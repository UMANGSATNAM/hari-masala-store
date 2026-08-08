const {PrismaClient}=require('@prisma/client');
const p=new PrismaClient();
p.order.findMany({take:5, orderBy:{createdAt:'desc'}}).then(r=>{
  console.log("Orders:", JSON.stringify(r.map(o => o.items), null, 2));
}).finally(()=>p.$disconnect());
