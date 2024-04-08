odoo.define('ap_hr_attendance_extension.test_custom_attendance', function (require) {
    "use strict";

    var testUtils = require('web.test_utils');

    QUnit.module('Custom Attendance', {
        beforeEach: function () {
            this.data = {
                'hr.employee': {
                    fields: {
                        name: {string: "Name", type: "char"},
                    },
                    records: [
                        {id: 1, name: "Employee 1"},
                        {id: 2, name: "Employee 2"},
                    ],
                },
                'project.project': {
                    fields: {
                        name: {string: "Name", type: "char"},
                    },
                    records: [
                        {id: 1, name: "Project 1"},
                        {id: 2, name: "Project 2"},
                    ],
                },
                'project.task': {
                    fields: {
                        name: {string: "Name", type: "char"},
                        project_id: {string: "Project", type: "many2one", relation: 'project.project'},
                    },
                    records: [
                        {id: 1, name: "Task 1", project_id: 1},
                        {id: 2, name: "Task 2", project_id: 1},
                        {id: 3, name: "Task 3", project_id: 2},
                    ],
                },
            };
        },
    }, function () {
        QUnit.test('Project Selection', async function (assert) {
            assert.expect(1);
            var done = assert.async();

            var attendance = await testUtils.createComponent('ap_hr_attendance_extension.custom_attendance', {
                data: this.data,
                session: {
                    uid: 1,
                    user_context: {},
                },
            });

            await testUtils.dom.click(attendance.$('.o_hr_attendance_mainmenu .o_hr_attendance_project_select'));

            assert.containsOnce(attendance, '.o_hr_attendance_project_select .select2-container');

            attendance.destroy();
            done();
        });
    });
});
