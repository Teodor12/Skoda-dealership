import { Router, Request, Response, NextFunction } from "express";
import { PassportStatic } from "passport";
import { User } from "../model/User";
import { CarAdvertisement } from "../model/CarAdvertisement";
import { TestDrive } from "../model/TestDrive";
import { Appointment } from "../model/Appointment";

export const configureRoutes = (
  passport: PassportStatic,
  router: Router
): Router => {
  router.get("/", (req: Request, res: Response) => {
    res.status(200).send("Skoda dealership");
  });

  /********************* Endpoints for Authentication *********************/

  router.post("/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (error: any, user: any, info?: { message?: string }) => {
      if (error) {
        console.error(error);
        return res.status(500).send({ message: 'Internal server error', error });
      }
      if (!user) {
        // Failed login: send the correct reason
        return res.status(400).send({ message: info?.message || 'Authentication failed' });
      }

      req.login(user, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: 'Login failed' });
        }
        console.log('/login returning 200');
        return res.status(200).send({ message: 'Login successful', user });
      });
    })(req, res, next);
  });

  router.post("/register", async (req: Request, res: Response) => {
    User.findOne({ email: req.body.email }).then((existingUser) => {
      if (existingUser) {
        return res.status(409).send("Email is already in use.");
      }

      const user = new User({
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
  });

  router.post("/logout", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      req.logout((error) => {
        if (error) {
          console.log(error);
          res.status(500).send("Internal server error.");
        }
        res.status(200).send("Successfully logged out.");
      });
    } else {
      res.status(400).send("User is not logged in.");
    }
  });

  router.get("/checkAuth", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      res.status(200).send(true);
    } else {
      res.status(200).send(false);
    }
  });

  /********************* Endpoints for Users *********************/
  router.get("/getAllUsers", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      const query = User.find();
      query
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send("Internal server error.");
        });
    } else {
      res.status(500).send("User is not logged in.");
    }
  });

  router.get("/getUserByEmail", (req: Request, res: Response) => {
    const email = req.query.email;
    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json("Email is required and must be a string.");
    }
    const query = User.findOne({ email });
    query
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Internal server error.");
      });
  });

  router.delete("/deleteUser", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      const id = req.query.id;
      const query = User.deleteOne({ _id: id });
      query
        .then((data) => {
          console.log(data);
          res.status(200).send(data);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send("Internal server error.");
        });
    } else {
      res.status(500).send("User is not logged in.");
    }
  });

  /********************* Endpoints for CarAdvertisements *********************/

  router.post("/addCarAdvertisement", (req: Request, res: Response) => {
    const carAdvertisement = new CarAdvertisement({
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

  router.get("/getAllCarAdvertisements", (req: Request, res: Response) => {
    const query = CarAdvertisement.find();
    query
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Internal server error.");
      });
  });

  router.put("/updateCarAdvertisement", (req: Request, res: Response) => {
    const { _id, ...updateData } = req.body;
    if (!_id) {
      return res.status(400).send("Missing id parameter.");
    }
    CarAdvertisement.findByIdAndUpdate(_id, updateData, { new: true })
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

  router.delete("/deleteCarAdvertisement", (req: Request, res: Response) => {
    const id = req.query.id;
    console.log("router.delete " + id);
    if (!id) {
      return res.status(401).send("Missing id parameter.");
    }
    const query = CarAdvertisement.deleteOne({ _id: id });
    query
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((error) => {
        res.status(500).send("Internal server error.");
      });
  });

  /********************* Endpoints for TestDrives *********************/

  router.post("/addTestDrive", (req: Request, res: Response) => {
    const { user, carAdvertisement, testDriveDate } = req.body;

    if (!user || !carAdvertisement || !testDriveDate) {
      return res.status(400).send("Missing required fields");
    }
    const newTestDrive = new TestDrive({
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

  router.get("/getAllTestDrives", (req: Request, res: Response) => {
    console.log("GET /getAllTestDrives called");

    TestDrive.find()
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

  router.delete("/deleteTestDrive", (req: Request, res: Response) => {
    console.log("DELETE /deleteTestDrive called");
    const id = req.query.id;
    if (!id) {
      return res.status(401).send("Missing id parameter.");
    }
    const query = TestDrive.deleteOne({ _id: id });
    query.then((data) => {
      res.status(200).send(data);
    })
      .catch((error) => {
        res.status(500).send(error);

      });
  });

  /********************* Endpoints for Appointments *********************/
  router.post("/addAppointment", (req: Request, res: Response) => {
    const { user, carAdvertisement, appointmentDate, appointmentType } = req.body;

    if (!user || !carAdvertisement || !appointmentDate || !appointmentType) {
      return res.status(400).send("Missing required fields");
    }

    const newAppointment = new Appointment({
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

  router.get("/getAllAppointments", (req: Request, res: Response) => {
    console.log("GET /getAllAppointments called");

    Appointment.find()
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

  router.delete("/deleteAppointment", (req: Request, res: Response) => {
    console.log("DELETE /deleteAppointment called");
    const id = req.query.id;
    if (!id) {
      return res.status(401).send("Missing id parameter.");
    }
    const query = Appointment.deleteOne({ _id: id });
    query.then((data) => {
      res.status(200).send(data);
    })
      .catch((error) => {
        res.status(500).send(error);

      });
  });

  return router;
};
