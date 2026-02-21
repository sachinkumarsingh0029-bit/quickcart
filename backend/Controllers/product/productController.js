const Seller = require("../../Models/seller/sellerSchema");
const Product = require("../../Models/product/productSchema");
const handleError = require("../../utils/errorHandler");
const natural = require("natural");
const Search = require("../../Models/search/searchSchema");

// GET all products of a seller by username
exports.getAllProductsOfSellerByUsername = async (req, res, next) => {
  try {
    const seller = await Seller.findOne({
      businessUsername: req.params.username,
    }).populate("productListings");
    if (!seller) {
      return handleError(res, {
        code: "not_found",
        status: "error",
        message: "Seller not found",
      });
    } else if (!seller.productListings || seller.productListings.length === 0) {
      return handleError(res, {
        code: "not_found",
        status: "error",
        message: "No products found for the seller",
      });
    } else {
      res.status(200).json({
        data: {
          seller: seller,
        },
      });
    }
  } catch (err) {
    return handleError(res, err);
  }
};

// GET a specific product of a seller
exports.getSellerProduct = async (req, res, next) => {
  try {
    const product = await Seller.findOne(
      {
        username: req.params.username,
        productListings: {
          $elemMatch: { _id: req.params.id },
        },
      },
      { "productListings.$": 1 }
    )
      .populate("productListings")
      .exec();

    if (!product) {
      return handleError(res, {
        code: "not_found",
        status: "error",
        message: "Product not found",
      });
    }

    const productListing = product.productListings[0];

    res.status(200).json({
      status: "success",
      message: "Retrieved the product listing",
      data: {
        productListing,
      },
    });
  } catch (err) {
    return handleError(res, err);
  }
};

// GET a product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: "ratings",
      populate: {
        path: "user",
        select: "username",
      },
    });
    console.log(product);
    if (!product) {
      return handleError(res, {
        code: "not_found",
        status: "error",
        message: "Product not found",
      });
    }

    // Send the response to the client
    res.status(200).json({
      status: "success",
      data: product,
    });

    // Increment the views count for the product
    Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    const searchQuery = new Search({
      category: product.category || "",
      userIdentifier: {
        userId: req.user ? req.user._id : null,
        sessionId: req.cookies.uid,
      },
      timestamp: Date.now(),
    });

    searchQuery
      .save()
      .then(() => {
        console.log("Search query saved successfully");
      })
      .catch((error) => {
        console.error("Error saving search query: ", error);
      });
  } catch (err) {
    return handleError(res, err);
  }
};

// Predict the top 10 most popular products in a category
exports.getTopProductsInCategory = async (req, res) => {
  try {
    const { category, numProducts = 10 } = req.body;

    const products = await Product.find({ isAvailable: true, category })
      .sort({ popularityScore: -1 })
      .limit(numProducts);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Predict the top most popular product
exports.getTopProducts = async (req, res) => {
  try {
    const numProducts = req.query.limit || 10;
    console.log(numProducts);
    const products = await Product.find({ isAvailable: true })
      .sort({ popularityScore: -1 })
      .limit(numProducts);

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Top products by popularityscore, views, likes, ratings
exports.getTopProductsByDifferentFilters = async (req, res) => {
  try {
    const numProducts = req.query.limit || 3;
    try {
      const trending = await Product.find({
        isAvailable: true,
        popularityScore: { $gt: -1 },
      })
        .sort({ popularityScore: "desc" })
        .limit(numProducts);
      const views = await Product.find({ isAvailable: true, views: { $gt: 0 } })
        .sort({ views: "desc" })
        .limit(numProducts);
      const likes = await Product.aggregate([
        // Match documents where the likes array has at least one element
        {
          $match: {
            isAvailable: true,
            likes: { $exists: true, $not: { $size: 0 } },
          },
        },
        // Add a computed field to the documents that contains the length of the likes array
        { $addFields: { likesCount: { $size: "$likes" } } },
        // Sort the documents by the likesCount field in descending order
        { $sort: { likesCount: -1 } },
        // Limit the number of results to numProducts
        { $limit: numProducts },
      ]);
      const ratings = await Product.find({
        isAvailable: true,
        avgrating: { $gt: 0 },
      })
        .sort({ avgrating: "desc" })
        .limit(numProducts);
      const response = {
        trending,
        views,
        likes,
        ratings,
      };
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Top products by top searched category
exports.getTopProductsByTopCategorySearched = async (req, res) => {
  try {
    const numProducts = req.query.limit || 4;
    const searchResults = await Search.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    const topCategories = searchResults.map((result) => result._id);
    const topProducts = await Promise.all(
      topCategories.map(async (category) => {
        const product = await Product.findOne({ isAvailable: true, category })
          .sort({ popularityScore: -1 })
          .limit(numProducts);
        return product;
      })
    );
    const filteredTopProducts = topProducts.filter(
      (product) => product !== null
    );
    res.json(filteredTopProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// search products by keywords
exports.searchProductsByKeywords = async (req, res, next) => {
  try {
    const query = req.query.search;
    const tokenizer = new natural.WordTokenizer();
    let stemmedQuery = tokenizer
      .tokenize(query.toLowerCase())
      .map((word) => natural.PorterStemmer.stem(word))
      .join(" ");
    let tokens = tokenizer.tokenize(query);
    let products;
    const sellerQuery = {
      $text: { $search: stemmedQuery },
    };
    const sellers = await Seller.find(sellerQuery).sort({
      ratingsAvg: -1,
    });
    const dbquery = {};

    if (query) {
      dbquery.$or = [
        { productName: stemmedQuery },
        { productDescription: stemmedQuery },
        { category: stemmedQuery },
        { tags: stemmedQuery },
        { keywords: stemmedQuery },
      ];
    }

    products = await Product.find(dbquery)
      .populate({
        path: "seller",
        select: "businessName businessEmail businessNumber",
      })
      .sort({
        popularityScore: -1,
      });

    if (products.length === 0) {
      products = await Product.find({
        $expr: {
          $gt: [{ $size: { $setIntersection: ["$keywords", tokens] } }, 0],
        },
      })
        .populate({
          path: "seller",
          select: "businessName businessEmail businessNumber",
        })
        .sort({ popularityScore: -1 });
    }

    console.log(tokens);
    res.status(200).json({ products, sellers });

    const searchQuery = new Search({
      query: query,
      category: products[0] ? products[0].category : "",
      userIdentifier: {
        userId: req.user ? req.user._id : null,
        sessionId: req.cookies.uid,
      },
      timestamp: Date.now(),
    });

    searchQuery
      .save()
      .then(() => {
        console.log("Search query saved successfully");
      })
      .catch((error) => {
        console.error("Error saving search query: ", error);
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get recommendations based on search
exports.getRecommendations = async (req, res) => {
  try {
    // Get the user's id from the session or request
    const userId = req.user?._id || "";
    const sessionId = req.cookies.uid;
    const limit = req.query.limit || 4;

    let searchQuery;
    // Get the user's search history
    if (req.cookies.uid) {
      searchQuery = { sessionId: sessionId, query: { $exists: true } };
    } else if (userId) {
      searchQuery = {
        userId: userId,
        query: { $exists: true },
      };
    } else {
      searchQuery = {
        $or: [
          { sessionId: sessionId, query: { $exists: true } },
          { userId: userId, query: { $exists: true } },
        ],
      };
    }
    const searches = await Search.find(searchQuery)
      .sort({ timestamp: -1 })
      .limit(20);

    if (searches.length === 0) {
      return res.status(200).json({ products: [] });
    }

    // Get all the products that match any of the user's search queries
    const query = searches.reduce((prev, curr) => {
      return prev + (prev.length > 0 ? " " : "") + curr.query;
    }, "");
    const tokenizer = new natural.WordTokenizer();
    let stemmedQuery = tokenizer
      .tokenize(query.toLowerCase())
      .map((word) => natural.PorterStemmer.stem(word))
      .join(" ");
    let tokens = tokenizer.tokenize(query);
    let products;
    const dbquery = { isAvailable: true };

    if (query) {
      const searchRegex = new RegExp(stemmedQuery | query, "i");
      dbquery.$or = [
        { productName: searchRegex },
        { productDescription: searchRegex },
        { category: searchRegex },
        { tags: searchRegex },
        { keywords: searchRegex },
      ];
    }

    products = await Product.find(dbquery)
      .populate({
        path: "seller",
        select: "businessName businessEmail businessNumber",
      })
      .limit(limit)
      .sort({
        ratingsAvg: -1,
        featured: -1,
        views: -1,
        likes: -1,
      });

    if (products.length === 0) {
      products = await Product.find({
        $expr: {
          $gt: [{ $size: { $setIntersection: ["$keywords", tokens] } }, 0],
        },
      })
        .populate({
          path: "seller",
          select: "businessName businessEmail businessNumber",
        })
        .limit(limit)
        .sort({ createdAt: -1 });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// multiple searches from the database and suggest different types
// exports.getRecommendations = async (req, res) => {
//     try {
//         // Get the user's id from the session or request
//         const userId = req.user?._id || "";
//         const sessionId = req.cookies.uid;
//         const limit = req.query.limit || 4;

//         let searchQuery;
//         // Get the user's search history
//         if (!userId && !sessionId) {
//             return res.status(200).json({ products: [] });
//         } else if (req.cookies.uid) {
//             searchQuery = { sessionId: sessionId, query: { $exists: true } };
//         } else if (userId) {
//             searchQuery = {
//                 userId: userId,
//                 query: { $exists: true }
//             };
//         } else {
//             searchQuery = {
//                 $or: [{ sessionId: sessionId, query: { $exists: true } }, { userId: userId, query: { $exists: true } }],
//             };
//         }

//         const searches = await Search.find(searchQuery)
//             .sort({ timestamp: -1 })
//             .limit(20); // Increase the limit to fetch multiple search queries

//         let products = [];
//         let categories = [];
//         let tags = [];

//         // Get all the products that match any of the user's search queries
//         for (const search of searches) {
//             const query = search.query;
//             const tokenizer = new natural.WordTokenizer();
//             let stemmedQuery = tokenizer
//                 .tokenize(query.toLowerCase())
//                 .map((word) => natural.PorterStemmer.stem(word))
//                 .join(" ");
//             let tokens = tokenizer.tokenize(query);

//             const dbquery = { isAvailable: true };

//             if (query) {
//                 const searchRegex = new RegExp(stemmedQuery | query, "i");
//                 dbquery.$or = [
//                     { productName: searchRegex },
//                     { productDescription: searchRegex },
//                     { category: searchRegex },
//                     { tags: searchRegex },
//                     { keywords: searchRegex },
//                 ];
//             }

//             const searchProducts = await Product.find(dbquery)
//                 .populate({
//                     path: "seller",
//                     select: "businessName businessEmail businessNumber",
//                 })
//                 .sort({
//                     ratingsAvg: -1,
//                     featured: -1,
//                     views: -1,
//                     likes: -1,
//                 });

//             products = [...products, ...searchProducts];
//             searchProducts.forEach((product) => {
//                 if (!categories.includes(product.category)) {
//                     categories.push(product.category);
//                 }
//                 product.tags.forEach((tag) => {
//                     if (!tags.includes(tag)) {
//                         tags.push(tag);
//                     }
//                 });
//             });
//         }

//         // If no products are found from the search queries, suggest products from the popular categories and tags
//         if (products.length === 0) {
//             products = await Product.find({
//                 $or: [
//                     { category: { $in: categories } },
//                     { tags: { $in: tags } },
//                 ],
//                 isAvailable: true,
//             })
//                 .populate({
//                     path: "seller",
//                     select: "businessName businessEmail businessNumber",
//                 })
//                 .limit(limit)
//                 .sort({ createdAt: -1 });
//         }

//         res.status(200).json({ products });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// get products by category
exports.searchProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    let products;
    if (category.toLowerCase() === "all") {
      products = await Product.find({ isAvailable: true }).sort({
        popularityScore: -1,
      });
      const sellers = await Seller.find({}).sort({ ratingsAvg: -1 }).limit(5);

      res.json({ products, sellers: sellers });
    } else {
      const regex = new RegExp(category, "i");
      products = await Product.find({ category: regex }).sort({
        popularityScore: -1,
      });
      const sellers = await Seller.find({
        productCategories: { $in: [regex] },
      }).sort({ ratingsAvg: -1 });
      res.status(200).json({ products, sellers });
    }

    const searchQuery = new Search({
      category: products[0] ? products[0].category : "",
      userIdentifier: {
        userId: req.user ? req.user._id : null,
        sessionId: req.cookies.uid,
      },
      timestamp: Date.now(),
    });

    searchQuery
      .save()
      .then(() => {
        console.log("Search query saved successfully");
      })
      .catch((error) => {
        console.error("Error saving search query: ", error);
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
