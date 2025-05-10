import express from 'express'
import { GetCollegeDetail, Skills, getCourseDetails, getCourseYear } from '../controllers/collegecontroller.js'
const collegeRouter = express.Router()

collegeRouter.route('/getcollege').get(GetCollegeDetail)
collegeRouter.route('/skill').get(Skills)
collegeRouter.route('/course/:id').get(getCourseDetails)
collegeRouter.route('/years/:id').get(getCourseYear)

export {collegeRouter}
