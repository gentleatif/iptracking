const express = require('express');
const app = express();
const timezone = require('geo-tz');
const { PrismaClient } =require("@prisma/client");
const prisma = new PrismaClient();

app.get('/ipdata',async (req, res) => {

  const ip_address=req.query.ip;

  // const result = await prisma.ipv4.findMany({
  //   where: {
  //     AND: [
  //       {
  //         start_ip: { startsWith:firstThree }
  //       },
  //       {
  //         end_ip:{startsWith:firstThree}
  //       },
        
  //     {
  //       start_ip:{endsWith:{gte:6}}
  //     },
  //     {
  //       end_id:{endsWith:{lte:255}}
  //     }
  //     ]
  //   }
  // });

  const result = await prisma.$queryRaw`
  SELECT *
  FROM ipv4
  LEFT JOIN currency ON currency.country_code = ipv4.country_code
  WHERE
  start_ip <= ${ip_address}::inet
  AND end_ip >= ${ip_address}::inet

`;

//  include type , and ip 
result[0].type="ipv4";
result[0].ip=ip_address;

// remove start_ip and end_ip 
delete result[0].start_ip;
delete result[0].end_ip;

// include currency , timezone , location tables


  if (result) {
    return res.status(200).send(result)
  } else {
    return res.status(404).json({ error: 'IP address not found' });
  }
});
app.get("/",async (req,res)=>{
  return res.status(200).send({message:"Hello world"})
})


// cron job for updating database . 
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
