import { User } from "../model/User";
import { CarAdvertisement } from "../model/CarAdvertisement";
import { TestDrive } from "../model/TestDrive";
import { Appointment } from "../model/Appointment";

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function seed() {
    const mongoUri = 'mongodb://localhost:6000/my_db';

    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Load JSON files
        const userData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/init/my_db.users.json'), 'utf-8'));
        const carAdData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/init/my_db.caradvertisements.json'), 'utf-8'));
        const testDriveData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/init/my_db.testdrives.json'), 'utf-8'));
        const appointmentData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/init/my_db.appointments.json'), 'utf-8'));

        // Clean users
        const cleanedUsers = userData.map((u:any) => ({
            _id: new mongoose.Types.ObjectId(u._id.$oid),
            email: u.email,
            name: u.name,
            phoneNumber: u.phoneNumber,
            password: u.password,
        }));

        console.log('DEFAULT USERS:')
        console.log(cleanedUsers)
        console.log()

        // Clean car advertisements
        const cleanedCarAds = carAdData.map((c:any) => ({
            _id: new mongoose.Types.ObjectId(c._id.$oid),
            carModel: c.carModel,
            engine: c.engine,
            mileage: c.mileage,
            trimLevel: c.trimLevel,
            optionalService: c.optionalService,
            image: c.image,
            price: c.price,
        }));
        console.log('DEFAULT CAR ADVERTISEMENTS:')
        console.log(cleanedCarAds)
        console.log()


        // Clean test drives
        const cleanedTestDrives = testDriveData.map((t:any) => ({
            _id: new mongoose.Types.ObjectId(t._id.$oid),
            user: new mongoose.Types.ObjectId(t.user.$oid),
            carAdvertisement: new mongoose.Types.ObjectId(t.carAdvertisement.$oid),
            testDriveDate: new Date(t.testDriveDate.$date),
        }));
        console.log('DEFAULT TEST DRIVES:')
        console.log(cleanedTestDrives)
        console.log()


        // Clean appointments
        const cleanedAppointments = appointmentData.map((a:any) => ({
            _id: new mongoose.Types.ObjectId(a._id.$oid),
            user: new mongoose.Types.ObjectId(a.user.$oid),
            carAdvertisement: new mongoose.Types.ObjectId(a.carAdvertisement.$oid),
            appointmentDate: new Date(a.appointmentDate.$date),
            appointmentType: a.appointmentType,
        }));
        console.log('DEFAULT APPOINTMENTS:')
        console.log(cleanedAppointments)
        console.log()


        console.log('Resetting database...')
        await User.deleteMany({});
        await CarAdvertisement.deleteMany({});
        await TestDrive.deleteMany({});
        await Appointment.deleteMany({});
        console.log('Cleared existing collections');

        console.log('Inserting seed data...');
        await User.insertMany(cleanedUsers);
        await CarAdvertisement.insertMany(cleanedCarAds);
        await TestDrive.insertMany(cleanedTestDrives);
        await Appointment.insertMany(cleanedAppointments);

        console.log(' Database seeding complete!');
        process.exit(0);

    }

    catch (err) {
        console.error('Error during seeding:', err);
        process.exit(1);
    }
}

seed();
