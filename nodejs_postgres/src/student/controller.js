const pool = require("../../db");
const queries = require("./queries");

const getStudents = (req, res) => {
  pool.query(queries.getStudents, (e, results) => {
    if (e) {
      res.status(500).json({ DB_Error: e.message });
      throw e.message;
    }

    res.status(200).json(results.rows);
  });
};

const getStudentById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getStudentBiId, [id], (e, results) => {
    if (e) {
      res.status(500).json({ DB_Error: e.message });
      throw e.message;
    }

    res.status(200).json(results.rows);
  });
};

const addStudent = (req, res) => {
  const { name, email, age, dob } = req.body;

  pool.query(queries.checkEmailExists, [email], (e, results) => {
    if (results.rows.length) {
      return res.send({ message: "email already exists." });
    }
    pool.query(queries.addStudent, [name, email, age, dob], (e, results) => {
      if (e) {
        res.status(500).json({ DB_Error: e.message });
        throw e.message;
      }

      res.status(201).json({ message: "The student has been added" });
    });
  });
};

const removeStudent = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.getStudentBiId, [id], (e, results) => {
    if (!results.rows.length) {
      return res.send({ message: "Student does not exist" });
    }

    pool.query(queries.removeStudent, [id], (e, results) => {
      if (e) {
        res.status(500).json({ DB_Error: e.message });
        throw e.message;
      }

      res.status(200).json({ message: "The student has been removed" });
    });
  });
};

const updateStudent = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, age, dob } = req.body;
  pool.query(queries.getStudentBiId, [id], (e, results) => {
    if (!results.rows.length) {
      return res.send({ message: "Student does not exist" });
    }

    pool.query(
      queries.updateStudent,
      [name, email, age, dob, id],
      (e, results) => {
        if (e) {
          res.status(500).json({ DB_Error: e.message });
          throw e.message;
        }

        res.status(200).json({ message: "The student has been updated" });
      }
    );
  });
};

module.exports = {
  getStudents,
  getStudentById,
  addStudent,
  removeStudent,
  updateStudent,
};
