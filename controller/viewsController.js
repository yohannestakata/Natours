const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // Get tour date from collection
  const tours = await Tour.find();

  // Build template

  // Render template using tour data from step one

  res.status(200).render('overview', { title: 'All tours', tours });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  res.status(200).render('tour', { title: 'All tours', tour });
});
