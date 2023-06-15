let chai = require('chai');

let chaiHttp = require('chai-http');

let server = require('../server');

// assertion style

chai.should();

chai.use(chaiHttp);



describe("Nabanepal User API TEST", () => {

    // test the login route

    describe("POST /api/login", () => {

        it("It should login a user", (done) => {

            chai

              .request(server)

              .post("/api/v1/login")

              .send({

                email: "test03test@gmail.com",

                password: "Kdk@03test",

              })

              .end((err, res) => {

                res.should.have.status(200);

                done();

              });

        })

    });

   });

   describe("NabaNepal User API TEST", () => {
     // test the logout route

     describe("GET /api/logout", () => {
       it("It should logout a user", (done) => {
         chai

           .request(server)

           .get("/api/v1/logout")

           .end((err, res) => {
             res.should.have.status(200);

             done();
           });
       });
     });
   });


   describe("NabaNepal Product API TEST", () => {
     // test the product route

     describe("get /api/products", () => {
       it("It should get products", (done) => {
         chai

           .request(server)

           .get("/api/v1/product")

           .end((err, res) => {
             res.should.have.status(200);

             done();
           });
       });
     });
   });

   describe("NabaNepal Product API TEST", () => {
     // test the product route

     describe("POST /api/products", () => {
       it("It should get products", (done) => {

        
         chai

           .request(server)

           .post("/api/v1/admin/product/new")

           .send({
             name: "fridge",
             price: 100000,
             description: "This is fridge",
             images: {
               public_id: "fridge_image",
               url: "fridgeurl",
             },
             category: "fridge",
           })

           .end((err, res) => {
             res.should.have.status(201);

             done();
           });
       });
     });
   });