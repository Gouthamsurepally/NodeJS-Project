const Product=require('../models/Product');

const addProduct= async (req,res)=>{
    try{
        const {name,description,price,stock}=req.body;
            if(!name){
              return  res.status(400).json({message:'name required'});
            }
            if(!description){
              return  res.status(400).json({message:'description required'});
            }
            if(!price){
              return  res.status(400).json({message:'price required'});
            }
            if(!stock){
               return res.status(400).json({message:'stock required'});
            }
            if(!req.file){
                return res.status(400).json({message:'file should be image only'});
            }

            let image = '';
            if(req.file){
                image = `/uploads/images/${req.file.filename}`;
            }

            // if(!image){
            //     return res.status(400).json({message:'file shold be image only...'});
            // }


        const newProduct= new Product({name,description,price,stock,userId:req.user.id,image:image});
        await newProduct.save();

        res.status(200).json({message:'product added successfully',data:newProduct});

    }
    catch(error){
        console.log("file",error.message);
        res.status(500).json({message:error.message,error});
    }
};

// const getProducts= async (req,res)=>{
//     try{

//         const {name,minPrice,maxPrice,sortBy,order,page,limit}=req.body;
//         let filter={};

//         //filtering by name
//         if(name){
//             filter.name = { $regex:name, $options :'i'};      // case-insensitive search
//         };

//         //filtering by price range
//         if(minPrice){
//             filter.price = {...filter.price,$gte:parseFloat(minPrice)};
//         }
//         if(maxPrice){
//             filter.price = {...filter.price , $lte:parseFloat(maxPrice)};
//         }

//         //sorting
//         let sort={};
//         if(sortBy){
//             sort[sortBy]= order === 'desc' ? -1 : 1;    // default to ascending order
//         }
//         console.log("page num",parseInt(page))
//         //pagination
//         const currentPage = parseInt(page) || 1;
//         const itemsPerPage = parseInt(limit) || 5;
//         const skip =(currentPage-1)*itemsPerPage;
//         console.log("skip",skip);

//         const products= await Product.find(filter).sort(sort).skip(skip).limit(itemsPerPage);
        
//         const totalItems = await Product.countDocuments(filter);

//         res.status(200).json({products,
//             pagination : {
//                 currentPage,
//                 itemsPerPage,
//                 totalItems,
//                 totalPages: Math.ceil(totalItems/itemsPerPage),
//             }
//         });
//     }
//     catch(error){
//         res.status(500).json({message:error.message,error});
//     }
// };



// const getProducts = async (req,res)=>{
// try{
//     let {sorting,page,perPage,searchString,minPrice,maxPrice} = req.body;

//     //Sorting
//     if (sorting && Object.keys(sorting).length > 0) {
//         const sortOrder = sorting['order'] === 'dsc' ? 1 : -1; // Convert 'asc'/'desc' to 1/-1
//         sorting = { [sorting['key']]: sortOrder };
//     } else {
//         sorting = { createdAt: -1 }; // Default sort by creation date descending
//     }

//     // Pagination
//     page = page ? parseInt(page) : 1;
//     perPage =perPage ? parseInt(perPage) : 5;

//     // Filter criteria
//     let criteria = {
//         deleted :false,
//         $and:[],
//     };

//     // search by string (name,description,etc..)
//     if(searchString && searchString.trim()){
//         const searchRegex = new RegExp(searchString.trim(),"i");
//         criteria.$and.push({
//             $or:[
//                 {name:searchRegex},
//                 {description:searchRegex},
//                 {category:searchRegex},
//             ],
//         });
//     }

//     //Filter by price range
//     if(minPrice){
//         criteria.$and.push({price:{$gte:parseFloat(minPrice)}});
//     }
//     if(maxPrice){
//         criteria.$and.push({price:{$lte:parseFloat(maxPrice)}});
//     }


//     // remove $and if it is empty
//     if(criteria['$and'] && criteria['$and'].length === 0){
//         delete criteria['$and'];
//     }

//     console.log("criteria:",JSON.stringify(criteria));

//     // Construct the aggrigation pipeline

//     let query = [
//         {$match:criteria},      //filter by criteria
//         {$sort:sorting},        // sort results
//         {$facet:{
//             totalCount:[
//                 {$count:'count'},       // count total documents
//             ],
//             docs:[
//                 {$skip:(page - 1)* perPage},    //skip documents per pagination
//                 {$limit:perPage},               //limit the number of documents per page
//             ],
//           },
//         },
//     ];

//     const products = await Product.aggregate(query);

//     res.status(200).json({
//         status:'success',
//         msg:'List retrieved successfully',
//         data:products[0].docs,
//         pagination:{
//             currentPage:page,
//             perPage,
//             totalItems:products[0].totalCount[0] ? products[0].totalCount[0].count:0,
//             totalPages:Math.ceil((products[0].totalCount[0]? products[0].totalCount[0].count:0)/perPage),
//         },
//     });


// }
// catch(error){
//     console.error('Error grtting in product list:', error);
//     res.status(500).json({status:'failed',msg:error.message});
// }
// }


const getProducts = async (req,res)=>{
    try{
        const {name,minPrice,maxPrice,sortBy,order,page,limit} = req.body;


        //pagination parameters
        const currentPage = parseInt(page) || 1;
        const itemsPerPage = parseInt(limit) || 5;
        const skip = (currentPage -1)*itemsPerPage;

        //aggregation pipeline
        const pipeline = [];

        //filtering by name
        if(name){
            pipeline.push({
                $match:{
                    name:{$regex :name, $options:'i'}
                }
            });
        }

        // filter  by price range
        if(minPrice || maxPrice){
            const priceFilter = {};
            if(minPrice) priceFilter.$gte = parseFloat(minPrice);
            if(maxPrice) priceFilter.$lte = parseFloat(maxPrice);
            pipeline.push({
                $match:{price:priceFilter}
            });
        }

        //sorting
        if(sortBy){
            const sortOrder =  order === 'desc' ? -1: 1;
            const sortCriteria = {};
            sortCriteria[sortBy] = sortOrder;
            pipeline.push({
                $sort:sortCriteria
            });
        }
        

        //Adding pagination steps
        pipeline.push(
            {$skip:skip},
            {$limit:itemsPerPage}
        );

        //aggregating data
        const products = await Product.aggregate(pipeline);

        //total items for pagination
        const totalItemsPipeline = pipeline.slice(0,-2);        //remove skip and limit stages
        totalItemsPipeline.push({
            $count:'totalItems'
        });
        const totalItemsResult = await Product.aggregate(totalItemsPipeline);
        const totalItems = totalItemsResult[0] ? totalItemsResult[0].totalItems : 0 ;       //sets the count of total items  if no result found it returns 0

        console.log('filterd,searched,sorted,and paginated products:',products);

        res.status(200).json({products,
            pagination:{
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages: Math.ceil(totalItems / itemsPerPage),
            }
        })
    }
    catch(error){
        res.status(500).json({message:error.message,error});
    }
}

const getProductById= async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            res.status(400).json({message:'product not found'});
        };

        res.status(200).json(product);
    }
    catch (error){
        res.status(500).json({message:error.message,error});
    }
};

const updateProduct = async(req,res)=>{
    try{
        const {name,description,price,stock} = req.body;

        let image = null;
        if(req.file){
            image = `/uploads/images/${req.file.filename}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
            {
                $set:{
                    name, description, price, stock,userId:req.user.id,
                    ...(image && {image}),      //only update the image if new one is provided
                },
            },
            { new:true , runValidators:true}
        );


        if(!updatedProduct){
            return res.status(400).json({message:'product not found'})
        }



        await updatedProduct.save();
        
        res.status(200).json({message:'Product updated successfully',data:updatedProduct});

    }
    catch(error){
        res.status(500).json({message:error.message, error});
    }
}

module.exports={addProduct,getProducts,getProductById,updateProduct};
