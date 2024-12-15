const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

//====================== Database Connection ===================================

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT,
});

//====================== START LOGIN ===================================
exports.login = (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    if (!email || !password) {
        req.flash('message', 'Email and password Required');
        return res.redirect('/login');
    }
    pool.query("SELECT * FROM users WHERE email = $1", [email], async (error, results) => {
        if (error) {
            console.log(error)
        };
        if (results.rows.length > 0) {
            var dbPassword = results.rows[0].password;
            var dbFirstname = results.rows[0].firstname;
            const valid = await bcrypt.compare(req.body.password, dbPassword);
            if (!valid) {
                req.flash('message', 'Password is Wrong, Try again!');
                return res.redirect('/login');
            } else {
                req.session.user = results.rows[0].firstname;
                req.flash('message', dbFirstname);
                return res.redirect('../welcome');
            }
        } else {
            req.flash('message', "User Doesn't Exist");
            return res.redirect('/login');
        }
    });
}
//====================== END LOGIN ===================================

//====================== START REGISTER ==============================
exports.register = (req, res) => {
    const { firstname, lastname, email, password, passwordconfirm } = req.body;
    pool.query('SELECT email FROM users WHERE email = $1', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.rows.length > 0) {
            req.flash('message', 'This Email is Already in USE');
            return res.redirect('../register');
        }
        else if (password !== passwordconfirm) {
            req.flash('message', "Password do not match");
            return res.redirect('../register');
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        pool.query('INSERT INTO users (email, password, firstname, lastname) VALUES ($1, $2, $3, $4)', [email, hashedPassword, firstname, lastname], (error, results) => {
            if (error) {
                console.log(error);
                return res.redirect("/register");
            } else {
                req.flash('message', "Your Data submitted successfully!");
                return res.redirect('../register');
            }
        })
    })
}
//====================== END REGISTER ===================================