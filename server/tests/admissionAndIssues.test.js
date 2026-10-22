const { test, describe } = require("node:test");
const assert = require("node:assert");
const Admission = require("../models/Admission");
const Issue = require("../models/Issue");
const admissionRouter = require("../routers/AdmissionRoute");
const issueRouter = require("../routers/issue");
const { verifyUser, requireAdmin } = require("../middlewares/auth.middlewares");

const getRouteLayer = (router, path, method) => {
  return router.stack.find(
    (layer) =>
      layer.route &&
      layer.route.path === path &&
      layer.route.methods[method.toLowerCase()]
  );
};

describe("Admission & Issue Routes and Models", () => {
  describe("Admission Model Configuration", () => {
    test("Admission model has index on aadhar field", () => {
      const indexes = Admission.schema.indexes();
      const hasAadharIndex = indexes.some(
        ([fields]) => fields.aadhar === 1
      );
      assert.strictEqual(
        hasAadharIndex,
        true,
        "Admission schema must have an index on aadhar"
      );
    });

    test("Admission model requires necessary identity fields", () => {
      const paths = Admission.schema.paths;
      assert.strictEqual(paths.name.isRequired, true);
      assert.strictEqual(paths.aadhar.isRequired, true);
      assert.strictEqual(paths.className.isRequired, true);
      assert.strictEqual(paths.phone.isRequired, true);
    });
  });

  describe("Issue Model Configuration", () => {
    test("Issue model has status and createdAt indexes for fast queries", () => {
      const indexes = Issue.schema.indexes();
      const hasStatusIndex = indexes.some(([fields]) => fields.status === 1);
      const hasCreatedAtIndex = indexes.some(([fields]) => fields.createdAt === -1);

      assert.strictEqual(hasStatusIndex, true, "Issue schema must index status");
      assert.strictEqual(hasCreatedAtIndex, true, "Issue schema must index createdAt");
    });
  });

  describe("Admission Route Security Middleware Stacks", () => {
    test("POST /addStudentAdmission is protected by verifyUser", () => {
      const layer = getRouteLayer(admissionRouter, "/addStudentAdmission", "POST");
      assert.ok(layer, "POST /addStudentAdmission route must exist");
      assert.ok(
        layer.route.stack.some(
          (fn) => fn.name === "verifyUser" || fn.handle === verifyUser
        ),
        "POST /addStudentAdmission must have verifyUser"
      );
    });

    test("DELETE /deleteAdmittedStudents/:id is protected by verifyUser and requireAdmin", () => {
      const layer = getRouteLayer(
        admissionRouter,
        "/deleteAdmittedStudents/:id",
        "DELETE"
      );
      assert.ok(layer, "DELETE /deleteAdmittedStudents/:id route must exist");
      assert.ok(
        layer.route.stack.some(
          (fn) => fn.name === "verifyUser" || fn.handle === verifyUser
        ),
        "DELETE /deleteAdmittedStudents must have verifyUser"
      );
      assert.ok(
        layer.route.stack.some(
          (fn) => fn.name === "requireAdmin" || fn.handle === requireAdmin
        ),
        "DELETE /deleteAdmittedStudents must have requireAdmin"
      );
    });
  });

  describe("Issue Route Security Middleware Stacks", () => {
    test("POST /issues and GET /fetchIssues require verifyUser", () => {
      const addLayer = getRouteLayer(issueRouter, "/issues", "POST");
      assert.ok(addLayer, "POST /issues route must exist");
      assert.ok(
        addLayer.route.stack.some(
          (fn) => fn.name === "verifyUser" || fn.handle === verifyUser
        )
      );

      const getLayer = getRouteLayer(issueRouter, "/fetchIssues", "GET");
      assert.ok(getLayer, "GET /fetchIssues route must exist");
      assert.ok(
        getLayer.route.stack.some(
          (fn) => fn.name === "verifyUser" || fn.handle === verifyUser
        )
      );
    });

    test("DELETE /deleteIssues/:id requires both verifyUser and requireAdmin", () => {
      const deleteLayer = getRouteLayer(issueRouter, "/deleteIssues/:id", "DELETE");
      assert.ok(deleteLayer, "DELETE /deleteIssues/:id must exist");
      assert.ok(
        deleteLayer.route.stack.some(
          (fn) => fn.name === "verifyUser" || fn.handle === verifyUser
        )
      );
      assert.ok(
        deleteLayer.route.stack.some(
          (fn) => fn.name === "requireAdmin" || fn.handle === requireAdmin
        )
      );
    });
  });
});
