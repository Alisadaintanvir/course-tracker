# Schema Update Instructions

Follow these steps to apply the schema changes:

1. First, stop your development server (Ctrl+C in the terminal where your app is running).

2. Run the following command to clear the Mongoose models cache:

   ```bash
   npm run clear-cache
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## Changes Made

I modified your Course schema to use a String type for the userId field instead of ObjectId. This change was necessary because your session uses a UUID string for the user ID rather than a MongoDB ObjectId.

Before:

```typescript
userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
```

After:

```typescript
userId: { type: String, required: true }
```

This change will resolve the validation error:

```
Error creating course: Error: Course validation failed: userId: Cast to ObjectId failed for value "d236ac9a-545f-4f1f-9d02-e58bcc0b2f2f" (type string) at path "userId" because of "BSONError"
```

The error was occurring because your application was trying to store a UUID string in a field that was expecting a MongoDB ObjectId.
