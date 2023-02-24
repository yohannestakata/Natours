const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "A review can't be empty"],
    },
    rating: {
      type: Number,
      max: [5, "Review can't have a rating greater than 5"],
      min: [1, "Review can't have a rating less than 1"],
    },
    createdAt: Date,
    tour: { type: mongoose.Schema.ObjectId, ref: 'Tour', required: true },
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: 'tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    const tour = await Tour.findById(tourId);
    tour.ratingsQuantity = stats[0].nRating;
    tour.ratingsAverage = stats[0].avgRating;
    tour.save();
  } else {
    const tour = await Tour.findById(tourId);
    tour.ratingsQuantity = 0;
    tour.ratinsAverage = 4.5;
    tour.save();
  }
};

reviewSchema.index({ tours: 1, user: 1 }, { unique: true });

reviewSchema.post('save', function (next) {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre('findOneAndDelete', async function (next) {
  this.r = await this.model.findOne(this.getQuery());
  next();
});

reviewSchema.post('findOneAndDelete', async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
