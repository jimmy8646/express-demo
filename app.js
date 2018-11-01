const Joi = require("joi");
const logger = require('./logger');
const auth = require('./auth');
const express = require("express");
const app = express();

app.use(express.json());

app.use(logger)
app.use(auth)

const courses = [{
    id: 1,
    name: "courses1"
  },
  {
    id: 2,
    name: "courses2"
  },
  {
    id: 3,
    name: "courses3"
  }
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.post("/api/courses", (req, res) => {
  const {
    error
  } = validateCourse(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("course id not fund");
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("course id not fund");

  const {
    error
  } = validateCourse(req.body)
  if (error) return res.status(400).send(error.details[0].message);


  course.name = req.body.name
  res.send(course)

});

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("course id not fund");

  const index = courses.indexOf(course);
  courses.splice(index, 1)

  res.send(course)
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`監聽 ${port}`);
});


const validateCourse = (course) => {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(course, schema);
}