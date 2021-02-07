import mongoose from "mongoose";

const Schema = mongoose.Schema;

const shapeSchema = new Schema({
    shape:{
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{ timestamps: true,  discriminatorKey: 'type' });

// Circle Schema
const circleSchema = new Schema({
    dimensions : {
        radius: {
            type: Number,
            required: true
        }
    }
})

// Square Schema
const squareSchema = new Schema({
    dimensions : {
        side: {
            type: Number,
        required: true
        }
    }
})

// Rectangle Schema
const rectangleSchema = new Schema({
    dimensions : {
        length: {
            type: Number,
        required: true
        },
        breadth: {
            type: Number,
        required: true
        }
    }
})

// Triangle Schema
const triangleSchema = new Schema({
    dimensions : {
        length_a :{
            type: Number,
        required: true
        },
        length_b: {
            type: Number,
        required: true
        },
        length_c: {
            type: Number,
        required: true
        }
    }
})

export const Shape = mongoose.model('Shape', shapeSchema);
export const Circle = Shape.discriminator('Circle', circleSchema);
export const Square = Shape.discriminator('Square', squareSchema);
export const Rectangle = Shape.discriminator('Rectangle', rectangleSchema);
export const Triangle = Shape.discriminator('Tember', triangleSchema);
