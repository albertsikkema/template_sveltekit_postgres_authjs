// +layout.server.js
export async function load(event) {
    return {
      user: event.locals.session.user,
    };
  }