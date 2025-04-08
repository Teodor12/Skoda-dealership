import { Router, Request, Response, NextFunction } from 'express';
import { MainClass } from '../main-class';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import { CarAdvertisement } from '../model/CarAdvertisement';


export const configureRoutes = (passport: PassportStatic, router: Router): Router => {

    router.get('/', (req: Request, res: Response) => {
        res.status(200).send('Skoda dealership');
    });


    /********************* Endpoints for Authentication *********************/

    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: Error | null, user: typeof User | false, info?: { message: string }) => {
            if (error) {
                return res.status(500).json({ message: 'Internal server error.' });
            }

            if (!user) {
                return res.status(400).json({ message: info?.message || 'User not found.' });
            }

            req.login(user, (err: Error | null) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Internal server error.' });
                } else {
                    return res.status(200).json(user);
                }
            });
        })(req, res, next);
    });

    router.post('/register',  async (req: Request, res: Response) => {
        User.findOne({ email: req.body.email }).then(existingUser => {
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already in use.'});
            }

            const user = new User({email: req.body.email, password: req.body.password, name: req.body.name, phoneNumber: req.body.phoneNumber});
            user.save().then(data => {
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send(error);
            })
        });
    });

    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/checkAuth', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    });

    /********************* Endpoints for Users *********************/
    router.get('/getAllUsers', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.delete('/deleteUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = User.deleteOne({_id: id});
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });


    /********************* Endpoints for CarAdvertisements *********************/

    router.post('/addCarAdvertisement', (req: Request, res: Response) => {
            const carAdvertisement = new CarAdvertisement({
                carModel:req.body.carModel,
                engine:req.body.engine,
                mileage:req.body.mileage,
                trimLevel:req.body.trimLevel,
                optionalService:req.body.optionalService,
                image:req.body.image,
                price:req.body.price
            });
            carAdvertisement.save().then(data => {
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send(error);
            })
        });

    router.get('/getAllCarAdvertisements', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = CarAdvertisement.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(401).send('Admin is not logged in.');
        }
    });

    router.delete('/deleteCarAdvertisement',(req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            if (!id) {
                return res.status(400).send('Missing id parameter.');
            }
            const query = CarAdvertisement.deleteOne({_id: id});
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(401).send('Admin is not logged in.');
        }
    });

    return router;


}