import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const BaseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    // baseUrl: 'http://localhost:3000',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().main.auth_token
      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (patch) => ({
        url: `auth/login`,
        method: 'POST',
        body: patch,
      }),
    }),

    getAllUsers: builder.query({
      query: () => `user/all`,
    }),

    getSingleUser: builder.query({
      query: (id) => `user/${id}`,
    }),

    updateSingleUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `user/update/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),

    createProject: builder.mutation({
      query: (patch) => ({
        url: `project/create`,
        method: 'POST',
        body: patch,
      }),
    }),

    getAllProjectsByUserId: builder.query({
      query: (id) => `project/all/${id}`,
    }),

    getSingleProject: builder.query({
      query: (id) => `project/${id}`,
    }),

    updateSingleProject: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `project/update/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),

    deleteSingleProject: builder.mutation({
      query: (id) => ({
        url: `project/delete/${id}`,
        method: 'DELETE',
      }),
    }),

    createDetailTracker: builder.mutation({
      query: (patch) => ({
        url: `details-tracker/create`,
        method: 'POST',
        body: patch,
      }),
    }),

    getAllDetailTrackersByProjectId: builder.query({
      query: (id) => `details-tracker/all/${id}`,
    }),

    getSingleDetailTracker: builder.query({
      query: (id) => `details-tracker/${id}`,
    }),

    updateSingleDetailTracker: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `details-tracker/update/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),

    deleteSingleDetailTracker: builder.mutation({
      query: ({ id, projectId }) => ({
        url: `details-tracker/delete/${id}`,
        method: 'DELETE',
        body: { projectId },
      }),
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useGetAllUsersQuery,
  useCreateProjectMutation,
  useGetSingleProjectQuery,
  useGetSingleUserQuery,
  useUpdateSingleProjectMutation,
  useUpdateSingleUserMutation,
  useDeleteSingleProjectMutation,
  useGetAllProjectsByUserIdQuery,
  useGetAllDetailTrackersByProjectIdQuery,
  useGetSingleDetailTrackerQuery,
  useUpdateSingleDetailTrackerMutation,
  useDeleteSingleDetailTrackerMutation,
  useCreateDetailTrackerMutation,
} = BaseApi
