# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Product Filtering And Sorting Notes

The products query flow now supports global server-side sorting and pagination using a derived field:

- `effectivePrice` (price after discount)
- Cursor shape: `{ primaryValue, id }`
- Default pagination limit remains `20`

### Required Migration

Existing product documents should be backfilled with `effectivePrice`.

Use the helper:

- `backfillProductsEffectivePrice` in `Backend/Firebase/DBAPI.tsx`

Run it from an admin-only maintenance flow or a controlled one-time script.

### Required Firestore Composite Indexes

Create the following indexes for `products` collection (direction `ASC` and mirrored `DESC` when needed):

1. `category`, `effectivePrice`, `__name__`
2. `effectivePrice`, `__name__`
3. `name`, `__name__`
4. `category`, `name`, `__name__`

Without these indexes, Firestore may throw `FAILED_PRECONDITION` for filtered/sorted queries.
