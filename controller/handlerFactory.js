/* eslint-disable no-restricted-syntax */
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const QueryBuilder = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }

    res.status(204).json({
      status: 'success',
      data: { doc },
    });
  });

exports.create = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { doc },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    const doc = await Model.findById(req.params.id);
    for (const [key, value] of Object.entries(req.body)) {
      doc[`${key}`] = value;
    }
    doc.save();

    if (!doc) {
      return next(new AppError('No tour found with that id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOpt) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (popOpt) query.populate(popOpt);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No tour found with that id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new QueryBuilder(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        doc,
      },
    });
  });
