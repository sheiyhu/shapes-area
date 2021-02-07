import { NextFunction, Request, Response} from 'express';
import {Triangle, Circle, Square, Rectangle, Shape} from './../models/shapeModel';
import {catchAsync} from './../utils/catchAsync';
import appError from './../utils/appError';

//to round to 2 decimal places
let roundUp = (toRound: number) =>  Math.round( toRound * 100) / 100;

let result //to store the result


// To calculate area of circle
const calcAreaOfCircle = (radius: number): void => {

    //checking for radius and its type
    if(!radius ||  typeof radius !== 'number'){
        throw new appError('Please provide under the dimensions, the radius and it must be number', 400)
    }

    let calculatedArea = Math.PI * (radius**2)
    result = roundUp(calculatedArea)
}

// To calculate area of square
const calcAreaOfSquare = (side: number): void => {

    // checking for saide and its type
    if(!side){
        throw new appError('Please provide under the dimensions, the side, it must be number', 400)
    }

    let calculatedArea = side**2
    result = roundUp(calculatedArea)

}

// To calculate area of rectangle
const calcAreaOfRectangle = (length: number, breadth: number): void =>{

    //checking for the length and breadth and their type
    if(!length || !breadth){
        throw new appError('Please provide under the dimensions, length and breadth, they must be number', 400)
    }

    let calculatedArea = length * breadth
    result = roundUp(calculatedArea)
}

// To calculate area of triangle
const calcAreaOfTriangle = (length_a: number, length_b: number, length_c: number): void =>  {

    //checking for the lengths and their type
    if(!length_a || !length_b || !length_c){
        throw new appError('Please provide under the dimensions, three lenghts: length_a, length_b, length_c, they must be number', 400)
    }

    let s: number= (length_a + length_b + length_c) / 2;
    let calculatedArea: number = Math.sqrt(s*((s - length_a) * (s - length_b) + (s - length_c)));
    result = roundUp(calculatedArea)
}

//calculate the area
export const calculateArea = catchAsync( async (req: any, res: Response, next: NextFunction) => {

        //checking if shape is in the req.body
        if(!req.body.shape){
            return next(new appError("Please provide a shape. The acceptable shapes are Circle, Rectangle, Triangle and Square", 400))
        }

        //checking if dimensions is in the req.body
        if( !req.body.dimensions){
            return next(new appError("Please provide dimensions.", 400)) 
        }

        const shape = req.body.shape.toLowerCase()
        const dimensions = req.body.dimensions
        let area
        let response = {
            shape,
            dimensions,
            answer : null
        }
        
        //checking for the type of shape and calculating the area
        if (shape == "circle"){
            calcAreaOfCircle(dimensions.radius)
            response.answer = result.calculate()
            area = new Circle(response)
        } else if (shape == "square") {
            calcAreaOfSquare(dimensions.side)
            response.answer = result.calculate()
            area = new Square(response)
        } else if (shape == "rectangle") {
            calcAreaOfRectangle(dimensions.length, dimensions.breadth)
            response.answer = result.calculate()
            area = new Rectangle(response)
        } else if (shape == "triangle") {
            calcAreaOfTriangle(dimensions.length_a, dimensions.length_b, dimensions.length_c)
            response.answer = result.calculate()
            area = new Triangle(response)
        } else{
            return next(new appError("Invalid shape. The acceptable shapes are Circle, Rectangle, Triangle and Square", 404))
        }

        //adding the user id and saving to DB
        area.user = req.id
        await area.save()

        res.status(200).send({
            status:"Success",
            response
        })

});

//to get the previous calculations
export const getPreviousCalculations =  catchAsync( async (req: any, res: Response, next: NextFunction) => {
    const previousCalculations = await Shape.find({}).where({user: req.id}).select('-_id -type -__v -user -createdAt -updatedAt')

    res.status(200).send({
        status:"Success",
        previousCalculations
    })
})
