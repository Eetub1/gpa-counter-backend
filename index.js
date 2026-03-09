const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
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

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server running on port " + PORT))