// const Product=require('../models/productModel');
class Features {

    constructor(query, queryStr) {
    (this.query=query), (this.queryStr=queryStr)
    }


    search() {
      const title = this.queryStr.title
        ? {
          Name: {
            $regex: this.queryStr.title,
            $options: 'i',
          },
        }
        :{}
  
      this.query=this.query.find({ ...title });
      return this
    }

    filter() 
    {
      let min=Number(this.queryStr.mi||0);

      console.log(min)

      let Location=this.queryStr.Location
      ? {
        Location: {
          $regex: this.queryStr.Location,
          $options: 'i',
        },
      }
      :{}
      const title = this.queryStr.title
        ? {
          Name: {
            $regex: this.queryStr.title,
            $options: 'i',
          },
        }
        :{}

        this.query = this.query.find({
          $and: [
            { 
              $or: [ 
                { CTC: { $exists: true, $gte: min } },
                { Stipend: { $exists: true, $gte: min } }
              ]
            }, 
            { ...title }, 
            { ...Location }
          ]
        });
        return this;
    }

  }
  
  module.exports=Features