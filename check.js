const {PrismaClient}=require('@prisma/client');
const p=new PrismaClient();
p.product.findMany({select:{name:true, image:true}}).then(r=>console.log(r)).finally(()=>p.$disconnect());
