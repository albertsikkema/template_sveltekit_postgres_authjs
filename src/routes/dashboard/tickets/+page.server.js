import { errorLogger } from '$lib/logging/errorLogger.js';
import { getTickets, createTicket, updateTicket, deleteTicket, getTicket  } from '$lib/server/handlers/tickets';
import { getUsers } from '$lib/server/handlers/users';
import { logoutUser } from '$lib/authhelpers.js';
import { fail } from '@sveltejs/kit';

export async function load(event) {
    console.log('===> load event', event.locals);
    try {
        const tickets = await getTickets();
        const users = await getUsers();
        // create a object of users for the dropdown {"email":"name", "email":"name"}
        const userList = users.reduce((acc, user) => {
            acc[user.email] = user.name || user.email;
            return acc;
        }, {});

        console.log('===> load tickets', userList);
        const userEmail = event.locals.session.user.email
        return { tickets, userEmail, userList };
    } catch (error) {
        errorLogger(error, event, 'error getting tickets');
        return { error: 'Error getting tickets' };
    }
}

export const actions = {
    /**
     * Create Ticket - Handles MultiPart (File) Uploads
     */
    createticket: async (event) => {
      try {
        const data = await event.request.formData();
  
        // Extract standard form fields
        const title = data.get('title');
        const description = data.get('description');
        const created_by = data.get('created_by');
  
        // Process File Uploads
        const images = [];
        for (const entry of data.entries()) {
          const [key, value] = entry;
          if (key === 'images' && value instanceof Blob) {
            const buffer = Buffer.from(await value.arrayBuffer());
            images.push({ name: value.name, type: value.type, size: buffer.length, data: buffer });
          }
        }
  
        console.log('===> createticket parsed data:', { title, description, created_by, images });
  
        // Save ticket with attached files
        const result = await createTicket(title, description, created_by, images);
        return { success: true, message: 'Ticket created', data: result };
      } catch (error) {
        console.error('🚨 Error creating ticket:', error);
        return fail(400, { error: true, message: error.message });
      }
    },
  
    /**
     * Update Ticket - Handles MultiPart (File) Uploads
     */
    updateticket: async (event) => {
      try {
        const data = await event.request.formData();
  
        // Extract standard form fields
        const id = data.get('id');
        const title = data.get('title');
        const description = data.get('description');
        const created_by = data.get('created_by');
        const assigned_to = data.get('assigned_to');
        console.log('===> updateticket assigned_to:', assigned_to);
        const status = data.get('status');

        console.log('===> updateticket data:', { id, title, description, created_by, assigned_to, status });
  
        // Process File Uploads
        const images = [];
        for (const entry of data.entries()) {
          const [key, value] = entry;
          if (key === 'images' && value instanceof Blob) {
            const buffer = Buffer.from(await value.arrayBuffer());
            images.push({ name: value.name, type: value.type, size: buffer.length, data: buffer });
          }
        }
  
        console.log('===> updateticket parsed data:', { id, title, description, created_by, assigned_to, status, images });
  
        // Update ticket with attached files
        const result = await updateTicket(id, title, description, created_by, assigned_to, status, images);
        return { success: true, message: 'Ticket updated', data: result };
      } catch (error) {
        console.error('🚨 Error updating ticket:', error);
        return fail(400, { error: true, message: error.message });
      }
    },

    deleteticket: async (event) => {
        const data = await event.request.formData();
        const { id } = Object.fromEntries(data);
        try {
            await deleteTicket(id);
            return { success: true, message: 'Ticket deleted' };
        } catch (error) {
            errorLogger(error, event, 'error deleting ticket');
            return fail(400, { id, error: true, message: error.message });
        }
    },
};