import { z, defineCollection } from 'astro:content'

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      link: z.string().optional(),
      video: z.string().optional(),
      image: image().optional(),
      tags: z.array(
        z.object({
          name: z.string(),
          class: z.string(),
          icon: z.any().optional()
        })
      ),
      isDraft: z.boolean(),
      language: z.string()
    })
})

export const collections = { projects }
