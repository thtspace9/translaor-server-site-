//Require necessary packages

const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const bodyParser = require('body-parser');
const app = express();
app.use(cors());

//create the route and function to add user in database at the time to register their new account

// router.post('/RFusers/add', (req, res) => {

//    email = req.body.email,
//     password = req.body.password,
//     name = req.body.name,
//     phone = req.body.phoneNumber,
//     role = req.body.role
//     country = req.body.country,
//     image = req.body.image,

//       console.log(name,email)

//   bcrypt.hash(password,saltRounds,(err,hash)=>{

//     if(err){
//       console.error(err)
//     }
//     else{
//         let sql = "INSERT INTO RFusers ( email, password, name, phone, role, country, image) VALUES (?,?,?,?,?,?,?)";

//     connection.query(sql, [email, password, name, phone, role, country, image,hash], (err, result) => {
//       if (err) throw err;
//       console.log("successfully inserted");
//       res.json(result);
//     })
//     }
//   })

//   });


router.post('/RFusers/add', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phoneNumber;
  const role = req.body.role;
  const language = req.body.language;
  const country = req.body.country;
  const image = req.body.image;
  const admin = req.body.admin



  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error occurred during password hashing.');
    } else {
      let sql =
        'INSERT INTO RFusers (email, password, name, phone,warehouseShop, role,language, country, image,admin) VALUES (?,?,?,?,?,?,?,?,?,?)';

      connection.query(
        sql,
        [email, hash, name, phone,warehouseShop="", role.join(','), language, country, image, admin],
        (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error occurred during user insertion.');
          } else {
            console.log('Successfully inserted.');
            res.json(result);
          }
        }
      );
    }
  });
});


router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  connection.query(
    "SELECT * FROM RFusers WHERE email=?",
    [email],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0]?.password, (err, response) => {
          if (response) {
            const isRole = result[0].role.includes(role);
            console.log(typeof (isRole));
            if (isRole) {
              res.send(result);
              console.log(result)
            } else {
              res.send({ message: "User doesn't have the required role" });
            }
          } else {
            res.send({ message: "Wrong email/password combination!" });
          }
        });
      } else {
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});


router.patch('/changePassword', (req, res) => {
  const email = req.body.myEmail;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  connection.query(
    "SELECT * FROM RFusers WHERE email=?",
    [email],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(oldPassword, result[0]?.password, (err, response) => {
          if (response) {
            bcrypt.hash(newPassword, saltRounds, (err, hash) => {
              if (err) {
                console.error(err);
                res.status(500).send('Error occurred during password hashing.');
              } else {
                connection.query(
                  "UPDATE RFusers SET password=? WHERE email=?",
                  [hash, email],
                  (err, updateResult) => {
                    if (err) {
                      console.error(err);
                      res.status(500).send('Error occurred during password update.');
                    } else {
                      console.log('Password successfully updated.');
                      res.json(updateResult);
                    }
                  }
                );
              }
            });
          } else {
            res.send({ message: "Wrong email/old password combination!" });
          }
        });
      } else {
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});



router.post('/check-user', (req, res) => {
  const email = req.body.email;


  // Execute SQL query
  const sql = 'SELECT * FROM RFusers WHERE email = ?';
  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Failed to execute query' });
    } else {
      if (results.length > 0) {
        // User with the given email exists
        res.json({ exists: true });
      } else {
        // User with the given email does not exist
        res.json({ exists: false });
      }
    }
  });
});



//create the route and function to got all user information from database

router.get('/allRFusers', (req, res) => {

  const query = `SELECT * FROM RFusers WHERE 1`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(results);
    }
  });
});


router.get('/customerServiceLeader', (req, res) => {
  const query = `SELECT * FROM RFusers WHERE role LIKE '%~Customer-Service-Leader~%'`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(results);
    }
  });
});
router.get('/warehouseManger', (req, res) => {
  const query = `SELECT * FROM RFusers WHERE role LIKE '%~Warehouse-Manager~%'`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(results);
    }
  });
});

router.get('/finance', (req, res) => {
  const query = `SELECT * FROM RFusers WHERE role LIKE '%~Finance~%'`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(results);
    }
  });
});

//create the update function for make admin

router.put('/RFusers/update/admin/:id', (req, res) => {


  const admin = true;
  console.log(admin)
  let sql = `UPDATE RFusers SET admin='${true}' WHERE id=?`;
  connection.query(sql, [req.params.id], function (err, result) {
    if (err) throw err;
    console.log("successfully updated", result);
    res.json(result);;
  });

});





//create the route and function to update a specific user's admin information according to the email address

router.put('/RFusers/update/:id', (req, res) => {
  const userId = req.params.id;
  const editingUser = req.body;


  // Extract the fields that you want to update
  const { name, email, phone, role, warehouseShop, language, country } = editingUser;


  // Write the SQL query to update the user's information in the database
  const sql = `UPDATE RFusers SET name=?, email=?,phone=?,role=?,warehouseShop=?, language=?,country=? WHERE id=?`;

  // Execute the query with the values from the 'editingUser' object
  connection.query(sql, [name, email, phone, role,warehouseShop, language, country, userId], function (err, result) {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ error: 'Failed to update user' });
    }

    console.log('Successfully updated:', result);
    res.json(result);
  });
});



//create the route and function to delete a specific user information according to the email address

router.delete('/RFusers/delete/:id', (req, res) => {
  // INSERT INTO `players`(`id`, `name`, `club`) VALUES ('[value-1]','[value-2]','[value-3]')
  console.log(req.params.id);


  const sql = `DELETE FROM RFusers WHERE id=?`;
  connection.query(sql, [req.params.id], function (err, result) {
    if (err) throw err;
    console.log("successfully Delete", result);
    res.json(result);
  });
});



module.exports = router;