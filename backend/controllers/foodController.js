import foodModel from "../models/foodModel.js";
import fs from 'fs';

// Add food item
const addFood = async (req, res) => {
    const { name, description, price, category } = req.body;
    const image_filename = req.file ? req.file.filename : null;

    if (!name || !description || !price || !category || !image_filename) {
        console.error("Validation Error: All fields are required");
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const food = new foodModel({
        name,
        description,
        price,
        category,
        image: image_filename
    });

    try {
        await food.save();
        res.json({ success: true, message: "Food Added Successfully" });
    } catch (error) {
        console.error("Database Save Error:", error);
        res.status(500).json({ success: false, message: "Error adding food item" });
    }
}

// List all food items
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error("Database Fetch Error:", error);
        res.status(500).json({ success: false, message: "Error fetching food items" });
    }
}

// remove food item
const removeFood = async(req,res)=>{
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{});

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed Successfully"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export { addFood, listFood, removeFood};
