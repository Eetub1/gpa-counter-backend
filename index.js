const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err))


const courseSchema = new mongoose.Schema({
  name: String,
  grade: mongoose.Schema.Types.Mixed,
  op: Number,
  description: [String]
})

const Course = mongoose.model("Course", courseSchema)

app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find()
    res.json(courses)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.put("/api/courses/:id", async (req, res) => {
  const { id } = req.params
  const newCourse = req.body

  if (newCourse.password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Invalid admin password" })
  }

  try {
    const course = await Course.findOne({ _id: id })
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    course.name = newCourse.name || course.name
    course.grade = newCourse.grade || course.grade
    course.op = newCourse.op || course.op
    course.description = newCourse.description || course.description

    const updatedCourse = await course.save()
    res.json(updatedCourse)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.post("/api/courses", async (req, res) => {
  const { password, name, grade, op, description } = req.body

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Invalid admin password" })
  }

  const course = new Course({ name, grade, op, description })
  try {
    const savedCourse = await course.save()
    res.status(201).json(savedCourse)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server running on port " + PORT))