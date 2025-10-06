const express=require('express')
const routers=express.Router()
routers.get('/search',async (req,res) => {
    try {
        const {q,category,priceMin,priceMax,page=1,limit=20}=req.body
        const attributeQueries=Object.keys(req.query).filter(key => key.startsWith('attributes['))
    .map(key => ({
      key: key.match(/\[(.*?)\]/)[1], // extracts 'color' from 'attributes[color]'
      value: req.query[key]
    }));
    const offset=(parseInt(page)-1)*parseInt(limit)
    let whereClauses = [];
  let queryParams = [];
  let paramIndex = 1;
    if(q)
    {
        whereClauses.push()
    }
    } catch (error) {
        
    }
})