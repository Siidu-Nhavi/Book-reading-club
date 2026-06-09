const { generateSalt, hashPassword } = require("../../utils/security.js");
const { demoPasswordEnvKey, paths } = require("../lib/config");
const { loadJsonFile } = require("../lib/fileLoader");
const { pickOne, randomInt } = require("../lib/random");
const { normalizeSlug } = require("../lib/text");

async function buildDemoUsers(count, rng) {
  const password = process.env[demoPasswordEnvKey];

  if (!password) {
    throw new Error(`Missing required env var: ${demoPasswordEnvKey}`);
  }

  const profileData = loadJsonFile(paths.sampleUsers);
  const firstNames = profileData.firstNames || ["Reader"];
  const lastNames = profileData.lastNames || ["User"];
  const cities = profileData.cities || ["Mumbai"];
  const bios = profileData.bios || ["Avid reader"];
  const streets = profileData.streets || ["Main Road"];
  const users = [];

  for (let index = 0; index < count; index++) {
    const firstName = pickOne(rng, firstNames);
    const lastName = pickOne(rng, lastNames);
    const city = pickOne(rng, cities);
    const bio = pickOne(rng, bios);
    const street = pickOne(rng, streets);
    const suffix = String(index + 1).padStart(3, "0");
    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    users.push({
      name: `${firstName} ${lastName}`,
      email: `${normalizeSlug(firstName)}.${normalizeSlug(lastName)}.${suffix}@demo.local`,
      password: hashedPassword,
      salt,
      role: index === 0 ? "admin" : "user",
      depositAmount: 0,
      depositStatus: "pending",
      activeRentalsCount: 0,
      maxRentalsAllowed: randomInt(rng, 4, 8),
      isSuspended: index !== 0 && index % 23 === 0,
      profile: {
        avatarUrl: "",
        bio,
        mobileNumber: `9${String(randomInt(rng, 100000000, 999999999))}`,
        address: `${street}, ${city}`,
      },
    });
  }

  // const adminSalt = await generateSalt();
  // const adminHashedPassword = await hashPassword("default@123", adminSalt);

  // users.push({
  //   name: 'Admin',
  //   email: "admin@gmail.com",
  //   password: adminHashedPassword,
  //   salt: adminSalt,
  //   role: "admin",
  //   depositAmount: 0,
  //   depositStatus: "pending",
  //   activeRentalsCount: 0,
  //   maxRentalsAllowed: randomInt(rng, 4, 8),
  //   isSuspended: false,
  //   profile: {
  //     avatarUrl: "",
  //     bio: "I am a reader",
  //     mobileNumber: "9028302820",
  //     address: "warananagar, panhala",
  //   },
  // });

  return users;
}

async function buildAdminUser() {
  const salt = await generateSalt();
  const hashedPassword = await hashPassword("default@1234", salt);

  return {
    name: "Admin",
    email: "admin@gmail.com",
    password: hashedPassword,
    salt,
    role: "admin",
    depositAmount: 0,
    depositStatus: "pending",
    activeRentalsCount: 0,
    maxRentalsAllowed: 10,
    isSuspended: false,
    profile: {
      avatarUrl: "",
      bio: "System administrator",
      mobileNumber: "9000000000",
      address: "Admin Office, Mumbai",
    },
  };
}

module.exports = {
  buildAdminUser,
  buildDemoUsers,
};
