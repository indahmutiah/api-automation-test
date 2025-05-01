import { expect } from "chai";
import request from "supertest";
import dotenv from "dotenv";

import data from "./data.json" assert { type: "json" };

dotenv.config({ path: ".env" });

let token;
let bookingId;

describe("Booker API e2e testing", function () {
  before(async function () {
    const body = {
      username: process.env.API_BACKEND_USERNAME,
      password: process.env.API_BACKEND_PASSWORD,
    };
    const response = await request(process.env.API_URL)
      .post("/auth")
      .set({ "Content-Type": "application/json", Accept: "application/json" })
      .send(body);
    expect(response.statusCode).to.equal(200);
    token = response.body.token;
    console.log("token:", token);
  });

  it("API Auth should return a valid token", async function () {
    expect(token).to.be.a("string");
    expect(token.length).to.be.greaterThan(0);
  });

  it("API Create Booking", async function () {
    const response = await request(process.env.API_URL)
      .post("/booking")
      .set({ "Content-Type": "application/json", Accept: "application/json" })
      .send(data);
    expect(response.statusCode).to.equal(200);
    expect(response.body.booking.firstname).to.equal(data.firstname);
    expect(response.body.booking.lastname).to.equal(data.lastname);
    console.log("response create Booking:", response.body);
    bookingId = response.body.bookingid;
  });

  it("API Get Booking", async function () {
    const response = await request(process.env.API_URL)
      .get(`/booking/${bookingId}`)
      .set({ "Content-Type": "application/json", Accept: "application/json" });
    expect(response.statusCode).to.equal(200);
    console.log("response get booking:", response.body);
  });

  it("API Delete Booking", async function () {
    const response = await request(process.env.API_URL)
      .delete(`/booking/${bookingId}`)
      .set({
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: `token=${token}`,
      });
    expect(response.statusCode).to.equal(201);
  });
});
