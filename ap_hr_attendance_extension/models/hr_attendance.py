# -*- coding: utf-8 -*-
from odoo import api, fields, models

class HrAttendance(models.Model):
    _inherit = 'hr.attendance'
    
    # fields required to store data in DB
    project_id = fields.Many2one('project.project', string="Project")
    task_id = fields.Many2one('project.task', string="Task", domain="[('project_id','!=',False), ('project_id','=',project_id)]")
    description = fields.Text(string="Description")

class HrEmployeeInh(models.Model):
    _inherit = 'hr.employee'
    
    current_project = fields.Char(string="Attendance Project")
    current_task = fields.Char(string="Task")
    current_description = fields.Text(string="Description")

    # helper method that helps to load projects
    @api.model
    def get_projects(self):
        all_projects = self.env['project.project'].search([])
        return {
            'project_ids': [{'id':project.id, 'name':project.display_name} for project in all_projects],
        }

    @api.model
    def get_tasks(self,project_id):
        project_id = self.env['project.project'].search([('id','=',project_id)])
        all_tasks = project_id.mapped('task_ids')
        return {
            'task_ids': [{'id':task.id, 'name':task.display_name, 'project_id':task.project_id.id} for task in all_tasks],
        }
    
    # Inherited _attendance_action_change function to update new project_id, task_id and description field
    def _attendance_action_change(self):
        res = super(HrEmployeeInh, self)._attendance_action_change()
        if self.attendance_state == 'checked_in':
            project_id = self.env.context.get('project_id', False)
            task_id = self.env.context.get('task_id', False)
            current_project = self.env.context.get('current_project', False)
            current_task = self.env.context.get('current_task', False)
            description = self.env.context.get('description', False)
            val = {
                'project_id': int(project_id) if project_id else False, 
                'task_id': int(task_id) if task_id else False,
                'description': str(description) if description else False
            }
            self.current_project = str(current_project) if current_project else False
            self.current_task = str(current_task) if current_task else False
            self.current_description = str(description) if description else False

            res.update(val)
        return res