odoo.define('ap_hr_attendance_extension.custom_attendance', function (require) {
    "use strict";

    var CustomAttendances = require('hr_attendance.my_attendances');
    var session = require('web.session');
    var field_utils = require('web.field_utils');


    CustomAttendances.include({
        events: Object.assign({}, CustomAttendances.prototype.events, {
            'change select[id="project_id"]': 'onchange_project_id',
        }),
        
        start: function () {
            var self = this;
            var def = this._super.apply(this, arguments);

            // Initialize Select2 for project_id for searchable
            this.$('#project_id').select2();
            this.$('#task_id').hide();
            return def;
        },

        //Load the project and tasks when attendance when attendance screen loads
        willStart: function () {
            var self = this;
            var def = this._rpc({
                model: 'hr.employee',
                method: 'search_read',
                args: [[['user_id', '=', this.getSession().uid]], ['attendance_state', 'name', 'hours_today','current_project','current_task','current_description']],
                context: session.user_context,
            })
            .then(function (res) {
                self.employee = res.length && res[0];
                if (res.length) {
                    self.hours_today = field_utils.format.float_time(self.employee.hours_today);
                    self.attendance_state = self.employee.attendance_state
                    self.current_project = self.employee.current_project;
                    self.current_task = self.employee.current_task;
                    self.current_description = self.employee.current_description;
                }
            });
            
            var def1 = self._rpc({
                model: 'hr.employee',
                method: 'get_projects',
            }).then(function (data) {
                self.data = data;
            });

            return Promise.all([def, def1, this._super.apply(this, arguments)]);

        },

        // dynamically filter the tasks of a project
        onchange_project_id: function (ev) {
            if ($("#project_id")[0]) {
                const projectID = $("#project_id").val();
                if (projectID != '') {
                    this._rpc({
                        model: 'hr.employee',
                        method: 'get_tasks',
                        args: [projectID],
                    })
                        .then(function(data){
                            if (data) {
                                var html = '<select class="col-7" name="task_id" id="task_id">';
                                html += '<option selected="selected" value=""></option>';
                                for (const task of data.task_ids) {
                                    html += "<option value='" + task.id + "'" + ">" + task.name + "</option>";
                                }
                                html += "</select>";
                                $("#task_id").replaceWith(html);
                                $('#task_id').show();
                                // make the tasks selector searchable
                                $('#task_id').select2();
                            }
                        });
                    
                    }
                } 
        },
        
        // Override the update_attendance to add our custom data
        update_attendance: function () {
            var self = this;
            var ctx = session.user_context;
            var project_id = $("#project_id").val();
            var task_id = $("#task_id").val();
            var description = $("#description").val();
            ctx['project_id'] = project_id;
            ctx['task_id'] = task_id;
            ctx['current_project'] = $("#project_id option:selected").text().replace(/[\n\t]/g, '');
            ctx['current_task'] = $("#task_id option:selected").text().replace(/[\n\t]/g, '');
            ctx['description'] = description;
            this._rpc({
                model: 'hr.employee',
                method: 'attendance_manual',
                args: [[self.employee.id], 'hr_attendance.hr_attendance_action_my_attendances'],
                context: ctx,
            })
                .then(function (result) {
                    if (result.action) {
                        self.do_action(result.action);
                    } else if (result.warning) {
                        self.displayNotification({ title: result.warning, type: 'danger' });
                    }
                });
        },
    });
    return CustomAttendances;
});
