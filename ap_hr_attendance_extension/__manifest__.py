# -*- coding: utf-8 -*-
{
    'name': 'HR attendance with Project and Task',
    'version': '16.0.1',
    'category': 'HR',
    'author': 'Sagar Jayswal',
    'summary': 'HR Attendance',
    'description': """
        This Module Allows user to create their attendance record with project, task and description
    """,
    'depends': ['hr_attendance','project'],
    'data': [
        'views/hr_attendance.xml',
    ],
    'qweb': [],
    'images': ["static/description/images/banner.png",
    "static/description/images/pic1.png",
    "static/description/images/pic2.png",
    "static/description/images/pic3.png"],
    'website': 'https://www.sagarcs.com',
    'installable': True,
    'auto_install': False,
    'application': True,
    'license': 'LGPL-3',
    'assets': {
        'web.assets_backend': [
            'ap_hr_attendance_extension/static/src/js/custom_attendance.js',
            'ap_hr_attendance_extension/static/src/xml/hr_attendance.xml',
        ],
    },
}
