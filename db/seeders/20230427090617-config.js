"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    // await queryInterface.bulkInsert(
    //   "config",
    //   [
    //     {
    //       tblname: "account",
    //       syncUrl:
    //         "v3/company/##companyId##/account?minorversion=##minorVersion##",
    //     },
    //     {
    //       tblname: "vendor",
    //       syncUrl:
    //         "v3/company/##companyId##/vendor?minorversion=##minorVersion##",
    //     },
    //   ],
    //   {}
    // );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // await queryInterface.bulkDelete("config", null, {});
  },
};
