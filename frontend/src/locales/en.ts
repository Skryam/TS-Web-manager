export default {
  translation: {
    appName: 'Task manager',
    flash: {
      session: {
        create: {
          success: 'You are logged in',
          error: 'Wrong email or password',
        },
        delete: {
          success: 'You are logged out',
        },
      },
      users: {
        create: {
          error: 'Failed to register',
          success: 'User registered successfully',
        },
        delete: {
          success: 'User deleted successfully',
          errRelated: 'User is associated with an active task and cannot be deleted',
          errNotUser: 'You do not have permission to delete this user',
        },
        patch: {
          success: 'User successfully changed',
          error: 'Failed to change user',
        },
      },
      statuses: {
        create: {
          success: 'Status created successfully',
          error: 'Failed to create status',
        },
        patch: {
          success: 'Status successfully changed',
          error: 'Failed to change status',
        },
        delete: {
          success: 'Status deleted successfully',
          error: 'Status is associated with an active task and cannot be deleted',
        },
      },
      tasks: {
        create: {
          success: 'Task created successfully',
          error: 'Failed to create task',
        },
        patch: {
          success: 'Task successfully changed',
          error: 'Failed to change task',
        },
        delete: {
          success: 'Task deleted successfully',
          error: 'You are not the author of task',
        },
      },
      labels: {
        create: {
          success: 'Label created successfully',
          error: 'Failed to create label',
        },
        patch: {
          success: 'Label successfully changed',
          error: 'Failed to change label',
        },
        delete: {
          success: 'Label deleted successfully',
          error: 'Label is associated with an active task and cannot be deleted',
        },
      },
      authError: 'Access denied! Please login',
    },

    components: {
      submitButton: {
        download: 'Loading',
        submit: 'Submit',
      },
      tableList: {
        deleteError: 'Error deleting',
        restrictError: 'Cannot delete, this entry is linked to a task',
        actions: 'Actions',
        created: 'Created',
        edit: 'Edit',
        delete: 'Delete'
      }
    },

    layouts: {
      application: {
        users: 'Users',
        lang: 'RU',
        signIn: 'Login',
        signUp: 'Register',
        signOut: 'Logout',
        statuses: 'Statuses',
        tasks: 'Tasks',
        labels: 'Labels',
      },
    },
    views: {
      session: {
        new: {
          email: 'Email',
          password: 'Password',
          signIn: 'Login',
          submit: 'Login',
        },
      },
      users: {
        title: 'Users',
        id: 'ID',
        firstName: 'First Name',
        lastName: 'Last name',
        email: 'Email',
        password: 'Password',
        createdAt: 'Created at',
        actions: 'Actions',
        editbtn: 'Edit',
        delete: 'Delete',
        new: {
          signUp: 'Register',
        },
        edit: {
          cardName: 'Edit User',
        },
      },
      welcome: {
        index: {
          hello: 'Web Manager',
          description: 'Online web manager',
          more: 'Learn more',
        },
      },
      statuses: {
        status: 'Statuses',
        create: 'Create status',
        name: 'Name',
        creationDate: 'Creation date',
        editbtn: 'Change',
        delete: 'Delete',
        new: {
          create: 'Status creation',
          name: 'Name',
          createButton: 'Create',
        },
        edit: {
          change: 'Status change',
          changeButton: 'Change',
        },
      },
      tasks: {
        title: 'Tasks',
        create: 'Create task',
        name: 'Name',
        description: 'Description',
        status: 'Status',
        creator: 'Author',
        executor: 'Executor',
        labels: 'Labels',
        createdAt: 'Creation date',
        editbtn: 'Edit',
        delete: 'Delete',
        userTasksFilter: 'My tasks',
        filter: {
          title: 'Filter',
          status: 'Status',
          statusHolder: 'All',
          executor: 'Executor',
          executorHolder: 'All',
          labels: 'Labels',
          showMyTasks: 'Show only my tasks',
          noLabels: 'Нет доступных лейблов',
          applyFilters: 'Apply filters'
        },
        new: {
          title: 'Task creation',
          name: 'Name',
          description: 'Description',
          status: 'Status',
          executor: 'Executor',
          labels: 'Labels',
          submit: 'Submit',
        },
        view: {
          creator: 'Author',
          executor: 'Executor',
          date: 'Creation date',
          edit: 'Edit',
          delete: 'Delete',
        },
        edit: {
          title: 'Task edit',
          name: 'Name',
          description: 'Description',
          status: 'Status',
          executor: 'Executor',
          labels: 'Labels',
          submit: 'Submit',
        },
      },
      labels: {
        title: 'Labels',
        create: 'Create label',
        name: 'Name',
        creationDate: 'Creation date',
        editbtn: 'Change',
        delete: 'Delete',
        new: {
          create: 'Label creation',
          name: 'Name',
          createButton: 'Create',
        },
        edit: {
          change: 'Label change',
          changeButton: 'Change',
        },
      },
    },
  },
};
