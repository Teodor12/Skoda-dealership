"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = void 0;
const User_1 = require("../model/User");
const CarAdvertisement_1 = require("../model/CarAdvertisement");
const TestDrive_1 = require("../model/TestDrive");
const Appointment_1 = require("../model/Appointment");
const configureRoutes = (passport, router) => {
    router.get("/", (req, res) => {
        res.status(200).send("Skoda dealership");
    });
    /********************* Endpoints for Authentication *********************/
    router.post("/login", (req, res, next) => {
        passport.authenticate('local', (error, user, info) => {
            if (error) {
                console.error(error);
                return res.status(500).send({ message: 'Internal server error', error });
            }
            if (!user) {
                // Failed login: send the correct reason
                return res.status(400).send({ message: (info === null || info === void 0 ? void 0 : info.message) || 'Authentication failed' });
            }
            req.login(user, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ message: 'Login failed' });
                }
                return res.status(200).send({ message: 'Login successful', user });
            });
        })(req, res, next);
    });
    router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        User_1.User.findOne({ email: req.body.email }).then((existingUser) => {
            if (existingUser) {
                return res.status(409).send("Email is already in use.");
            }
            const user = new User_1.User({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
            });
            user
                .save()
                .then((data) => {
                res.status(200).send(data);
            })
                .catch((error) => {
                res.status(500).send(error);
            });
        });
    }));
    router.post("/logout", (req, res) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send("Internal server error.");
                }
                res.status(200).send("Successfully logged out.");
            });
        }
        else {
            res.status(400).send("User is not logged in.");
        }
    });
    router.get("/checkAuth", (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        }
        else {
            res.status(200).send(false);
        }
    });
    /********************* Endpoints for Users *********************/
    router.get("/getAllUsers", (req, res) => {
        if (req.isAuthenticated()) {
            const query = User_1.User.find();
            query
                .then((data) => {
                res.status(200).send(data);
            })
                .catch((error) => {
                console.log(error);
                res.status(500).send("Internal server error.");
            });
        }
        else {
            res.status(500).send("User is not logged in.");
        }
    });
    router.get("/getUserByEmail", (req, res) => {
        const email = req.query.email;
        if (!email || typeof email !== "string") {
            return res
                .status(400)
                .json("Email is required and must be a string.");
        }
        const query = User_1.User.findOne({ email });
        query
            .then((data) => {
            res.status(200).send(data);
        })
            .catch((error) => {
            console.log(error);
            res.status(500).send("Internal server error.");
        });
    });
    router.delete("/deleteUser", (req, res) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = User_1.User.deleteOne({ _id: id });
            query
                .then((data) => {
                res.status(200).send(data);
            })
                .catch((error) => {
                console.log(error);
                res.status(500).send("Internal server error.");
            });
        }
        else {
            res.status(500).send("User is not logged in.");
        }
    });
    /********************* Endpoints for CarAdvertisements *********************/
    router.post("/addCarAdvertisement", (req, res) => {
        const carAdvertisement = new CarAdvertisement_1.CarAdvertisement({
            carModel: req.body.carModel,
            engine: req.body.engine,
            mileage: req.body.mileage,
            trimLevel: req.body.trimLevel,
            optionalService: req.body.optionalService,
            image: req.body.image,
            price: req.body.price,
        });
        carAdvertisement
            .save()
            .then((data) => {
            res.status(200).send(data);
        })
            .catch((error) => {
            res.status(500).send(error);
        });
    });
    router.get("/getAllCarAdvertisements", (req, res) => {
        const query = CarAdvertisement_1.CarAdvertisement.find();
        query
            .then((data) => {
            res.status(200).send(data);
        })
            .catch((error) => {
            console.log(error);
            res.status(500).send("Internal server error.");
        });
    });
    router.put("/updateCarAdvertisement", (req, res) => {
        const _a = req.body, { _id } = _a, updateData = __rest(_a, ["_id"]);
        if (!_id) {
            return res.status(400).send("Missing id parameter.");
        }
        CarAdvertisement_1.CarAdvertisement.findByIdAndUpdate(_id, updateData, { new: true })
            .then((updatedCar) => {
            if (!updatedCar) {
                return res.status(404).send("Car advertisement not found.");
            }
            res.status(200).send(updatedCar);
        })
            .catch((error) => {
            console.log(error);
            res.status(500).send("Internal server error.");
        });
    });
    router.delete("/deleteCarAdvertisement", (req, res) => {
        const id = req.query.id;
        if (!id) {
            return res.status(401).send("Missing id parameter.");
        }
        const query = CarAdvertisement_1.CarAdvertisement.deleteOne({ _id: id });
        query
            .then((data) => {
            res.status(200).send(data);
        })
            .catch((error) => {
            res.status(500).send("Internal server error.");
        });
    });
    /********************* Endpoints for TestDrives *********************/
    router.post("/addTestDrive", (req, res) => {
        const { user, carAdvertisement, testDriveDate } = req.body;
        if (!user || !carAdvertisement || !testDriveDate) {
            return res.status(400).send("Missing required fields");
        }
        const newTestDrive = new TestDrive_1.TestDrive({
            user,
            carAdvertisement,
            testDriveDate: new Date(testDriveDate),
        });
        newTestDrive
            .save()
            .then((data) => {
            res.status(200).send(data);
        })
            .catch((error) => {
            res.status(500).send(error);
        });
    });
    router.get("/getAllTestDrives", (req, res) => {
        TestDrive_1.TestDrive.find()
            .populate("user")
            .populate("carAdvertisement")
            .then((data) => {
            res.status(200).send(data);
        })
            .catch((error) => {
            console.error("Error fetching test drives:", error);
            res.status(500).send("Internal server error.");
        });
    });
    router.delete("/deleteTestDrive", (req, res) => {
        const id = req.query.id;
        if (!id) {
            return res.status(401).send("Missing id parameter.");
        }
        const query = TestDrive_1.TestDrive.deleteOne({ _id: id });
        query.then((data) => {
            res.status(200).send(data);
        })
            .catch((error) => {
            res.status(500).send(error);
        });
    });
    /********************* Endpoints for Appointments *********************/
    router.post("/addAppointment", (req, res) => {
        const { user, carAdvertisement, appointmentDate, appointmentType } = req.body;
        if (!user || !carAdvertisement || !appointmentDate || !appointmentType) {
            return res.status(400).send("Missing required fields");
        }
        const newAppointment = new Appointment_1.Appointment({
            user,
            carAdvertisement,
            appointmentDate: new Date(appointmentDate),
            appointmentType,
        });
        newAppointment
            .save()
            .then((data) => {
            res.status(200).send(data);
        })
            .catch((error) => {
            res.status(500).send(error);
        });
    });
    router.get("/getAllAppointments", (req, res) => {
        Appointment_1.Appointment.find()
            .populate("user")
            .populate("carAdvertisement")
            .then((data) => {
            res.status(200).send(data);
        })
            .catch((error) => {
            console.error("Error fetching test drives:", error);
            res.status(500).send("Internal server error.");
        });
    });
    router.delete("/deleteAppointment", (req, res) => {
        const id = req.query.id;
        if (!id) {
            return res.status(401).send("Missing id parameter.");
        }
        const query = Appointment_1.Appointment.deleteOne({ _id: id });
        query.then((data) => {
            res.status(200).send(data);
        })
            .catch((error) => {
            res.status(500).send(error);
        });
    });
    return router;
};
exports.configureRoutes = configureRoutes;
