use test
//1
db.books.distinct('title',{}).map(x=>x.toUpperCase())
//2
db.books.distinct('categories').map(x=>{
const res=db.books.countDocuments({categories:x});
return x +":" +res})
//3
db.books.aggregate([
    {$match:{title:/^A/}},
    {$project:{title:1,pageCount:1}},
    {$sort:{publishedDate:-1}}
])
//4
db.books.aggregate([
{ $match: { status: 'PUBLISH'}},
    { $set: { is_publish: true}},
    { $project: { status: 0 } }])
    
    
//5
db.books.aggregate([
{$skip:11},
{$limit:100},
{$match:{pageCount:{$gt:0}}},
{$project:{longDescription:0,shortDescription:0}},
{$out:'100books'}
])

//6
db.books.aggregate([
{$group:{
    _id:'$pageCount',
    countBooks:{$sum:1}}},
{$sort:{countBooks:1}}
])

//7
db.books.aggregate([
{$group:{
    _id:'$status',
    avgPagesbyBooks:{$avg:'$pageCount'},
    maxPages:{$max:'$pageCount'},
    minPages:{$min:'$pageCount'},
    first:{$first:'$pageCount'},
    last:{$last:'$pageCount'},}}
])

//8
db.books.aggregate([
{$group:
   {_id:'$status',
   distinctNameBooks:{$push:'$title'},
   multiNameBooks:{$addToSet:'$title'}}
}])

//9
db.books.aggregate([
{$unwind:'$authors'},
{$group:{
   _id:'$authors',
   distinctNameBooks:{$push:'$title'},
   countBooks:{$sum:1}
}}
,{$sort:{countBooks:-1}}  
])

//10
db.books.aggregate([
{$unwind:'$categories'},
{$group:{
    _id:'$categories',
    countBooks: {$sum:1}
}}
])


//11
db.books.aggregate([
{$unwind:'$authors'},
{$match:{authors:{$not:{$eq:""}}}},
{$group:{
   _id:'$authors'}}
  ,{$set:{name:'$_id'}},
  {$sort:{name:1}},
   {$out:'authors'}])