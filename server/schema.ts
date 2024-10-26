import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  pgEnum,
  serial,
  real,
  index,
} from "drizzle-orm/pg-core"
import type { AdapterAccount } from "next-auth/adapters"
import { createId } from "@paralleldrive/cuid2"
import { InferSelectModel, relations } from "drizzle-orm"

export const RoleEnum = pgEnum("roles", ["user", "admin"])

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  role: RoleEnum("roles").default("user"),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const emailTokens = pgTable(
  "email_tokens",
  {
    id: text("id").notNull().$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
)

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id").notNull().$defaultFn(() => createId()),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  email: text("email").notNull(),
},
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
)

export const twoFactorTokens = pgTable("two_factor_tokens", {
  id: text("id").notNull().$defaultFn(() => createId()),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  email: text("email").notNull(),
  userID: text("userID").references(() => users.id, { onDelete: "cascade" }),
},
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
)

export const products = pgTable("products", {
  id: serial("id").primaryKey(), // This is going to be incrementing like 1, 2, 3, 4, ...
  description: text("description").notNull(),
  title: text("title").notNull(),
  created: timestamp("created").defaultNow(),
  price: real("price").notNull(),
})

export const productVariants = pgTable("productVariants", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(),
  productType: text("productType").notNull(),
  updated: timestamp("updated").defaultNow(),
  productID: serial("productID").notNull().references(() => products.id, { onDelete: "cascade" })
})

export const variantImages = pgTable("variantImages", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  size: real("size").notNull(),
  name: text("name").notNull(),
  order: real("order").notNull(),
  variantID: serial("variantID").notNull().references(() => productVariants.id, { onDelete: "cascade" })
})

export const variantTags = pgTable("variantTags", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  variantID: serial("variantID").notNull().references(() => productVariants.id, { onDelete: "cascade" })
})

// The relationship between the product. i.e A product can have many product variants
export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariants, { relationName: "productVariants" }),
  reviews: many(reviews, { relationName: "reviews" })
}))

// The relationship between the productVariant. i.e A product variant can have one product variants and A product variant can have many variant images and tags
export const productVariantsRelations = relations(productVariants, ({ many, one }) => ({
  product: one(products, {
    fields: [productVariants.productID],
    references: [products.id],
    relationName: "productVariants"
  }),
  variantImages: many(variantImages, { relationName: "variantImages" }),
  variantTags: many(variantTags, { relationName: "variantTags" }),
})
)

// variant images should only have one product variant
export const variantImagesRelations = relations(variantImages, ({ one }) => ({
  productVariant: one(productVariants, {
    fields: [variantImages.variantID],
    references: [productVariants.id],
    relationName: "variantImages"
  })
}))

// variant tags should only have one product variant
export const variantTagsRelations = relations(variantTags, ({ one }) => ({
  productVariant: one(productVariants, {
    fields: [variantTags.variantID],
    references: [productVariants.id],
    relationName: "variantTags"
  })
}))

// reviews schema
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  rating: real("rating").notNull(),
  userID: text("userID").notNull().references(() => users.id, { onDelete: "cascade" }),
  productID: serial("productID").notNull().references(() => products.id, { onDelete: "cascade" }),
  comment: text("comment").notNull(),
  created: timestamp("created").defaultNow(),
}, (table) => {
  return {
    productIdx: index("productIdx").on(table.productID),
    userIdx: index("userIdx").on(table.userID)
  }
}) // we will index the productID and userID so that our queries will be faster. That's why we wrote the (table) => function after the comma in line 171

// review relations/relationship. A review can have one product and one user. However a user can have many different reviews, so we will create the user relations table down and do it
export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userID],
    references: [users.id],
    relationName: "user_reviews",
  }),
  product: one(products, {
    fields: [reviews.productID],
    references: [products.id],
    relationName: "reviews"
  })
}))

export const userRelations = relations(users, ({ many }) => ({
  reviews: many(reviews, {
    relationName: "user_reviews"
  })
}))
