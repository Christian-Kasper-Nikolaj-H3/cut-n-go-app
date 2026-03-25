import { Router } from 'express';
import { body, param } from 'express-validator';

import { authenticateToken } from "../../middlewares/Auth.js"
import { handleValidationErrors } from "../../middlewares/Validation.js";
import Treatments from "../../models/Treatments.js";
import TreatmentCategories from "../../models/TreatmentCategories.js";


const router = Router();

const idParamValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('id must be a positive integer')
        .toInt()
];

const createCategoryValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('title is required')
        .isLength({ min: 2, max: 120 }).withMessage('title must be between 2 and 120 characters'),
    body('description')
        .optional({ nullable: true })
        .isString().withMessage('description must be a string')
        .trim()
        .isLength({ max: 500 }).withMessage('description must be at most 500 characters')
];

const updateCategoryValidation = [
    ...idParamValidation,
    body('title')
        .optional()
        .trim()
        .notEmpty().withMessage('title cannot be empty')
        .isLength({ min: 2, max: 120 }).withMessage('title must be between 2 and 120 characters'),
    body('description')
        .optional({ nullable: true })
        .isString().withMessage('description must be a string')
        .trim()
        .isLength({ max: 500 }).withMessage('description must be at most 500 characters'),
    body().custom((_, { req }) => {
        if (req.body.title === undefined && req.body.description === undefined) {
            throw new Error('At least one of title or description is required');
        }
        return true;
    })
];

const createTreatmentValidation = [
    body('category_id')
        .isInt({ min: 1 }).withMessage('category_id must be a positive integer')
        .toInt(),
    body('name')
        .trim()
        .notEmpty().withMessage('name is required')
        .isLength({ min: 2, max: 120 }).withMessage('name must be between 2 and 120 characters'),
    body('price')
        .isFloat({ gt: 0 }).withMessage('price must be a number greater than 0')
        .toFloat()
];

const updateTreatmentValidation = [
    ...idParamValidation,
    body('category_id')
        .optional()
        .isInt({ min: 1 }).withMessage('category_id must be a positive integer')
        .toInt(),
    body('name')
        .optional()
        .trim()
        .notEmpty().withMessage('name cannot be empty')
        .isLength({ min: 2, max: 120 }).withMessage('name must be between 2 and 120 characters'),
    body('price')
        .optional()
        .isFloat({ gt: 0 }).withMessage('price must be a number greater than 0')
        .toFloat(),
    body().custom((_, { req }) => {
        if (req.body.category_id === undefined && req.body.name === undefined && req.body.price === undefined) {
            throw new Error('At least one of category_id, name or price is required');
        }
        return true;
    })
];


router.post('/categories/new', authenticateToken, ...createCategoryValidation, handleValidationErrors, async (req, res) => {
    try {
        const { title, description } = req.body;

        const category = await TreatmentCategories.create({
            title,
            description: description ?? null
        });

        return res.status(201).json({
            success: true,
            message: "Treatment category created successfully",
            data: {
                category
            }
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})

router.get('/categories', authenticateToken, handleValidationErrors, async (req, res) => {
    try {
        const categories = await TreatmentCategories.findAll({
            attributes: ['id', 'title', 'description']
        });

        return res.status(200).json({
            success: true,
            message: "Treatment categories retrieved successfully",
            data:{
                categories
            }
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})

router.put('/categories/update/:id', authenticateToken, ...updateCategoryValidation, handleValidationErrors, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const category = await TreatmentCategories.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Treatment category not found"
            });
        }

        if (title !== undefined) category.title = title;
        if (description !== undefined) category.description = description;

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Treatment category updated successfully",
            data: {
                category
            }
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.delete('/categories/delete/:id', authenticateToken, ...idParamValidation, handleValidationErrors, async (req, res) => {
    try {
        const { id } = req.params;

        const category = await TreatmentCategories.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Treatment category not found"
            });
        }

        await category.destroy();

        return res.status(200).json({
            success: true,
            message: "Treatment category deleted successfully"
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.post('/new', authenticateToken, ...createTreatmentValidation, handleValidationErrors, async (req, res) => {
    try {
        const { category_id, name, price } = req.body;

        const treatment = await Treatments.create({
            category_id: category_id,
            name: name,
            price: price
        });

        await treatment.reload({
            include: [
                {
                    model: TreatmentCategories,
                    as: 'category',
                    attributes: ['id', 'title']
                }
            ]
        });

        return res.status(201).json({
            success: true,
            message: "Treatment created successfully",
            data: {
                treatment
            }
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})

router.get('/all', authenticateToken, handleValidationErrors, async (req, res) => {
    try {
        const treatments = await Treatments.findAll({
            include: [
                {
                    model: TreatmentCategories,
                    as: 'category',
                    attributes: ['id', 'title']
                }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Treatments retrieved successfully",
            data:{
                treatments
            }
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.put('/update/:id', authenticateToken, ...updateTreatmentValidation, handleValidationErrors, async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, name, price } = req.body;

        const treatment = await Treatments.findByPk(id);
        if (!treatment) {
            return res.status(404).json({
                success: false,
                message: "Treatment not found"
            });
        }

        if(category_id) treatment.category_id = category_id;
        if(name) treatment.name = name;
        if(price) treatment.price = price;

        await treatment.save();

        await treatment.reload({
            include: [
                {
                    model: TreatmentCategories,
                    as: 'category',
                    attributes: ['id', 'title']
                }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Treatment updated successfully",
            data: {
                treatment
            }
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.delete('/delete/:id', authenticateToken, ...idParamValidation, handleValidationErrors, async (req, res) => {
    try {
        const { id } = req.params;

        const treatment = await Treatments.findByPk(id);
        if (!treatment) {
            return res.status(404).json({
                success: false,
                message: "Treatment not found"
            });
        }

        await treatment.destroy();

        return res.status(200).json({
            success: true,
            message: "Treatment deleted successfully"
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default router;
