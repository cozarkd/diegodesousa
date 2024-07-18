import { z, defineCollection } from 'astro:content'

const projects = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      link: z.string().optional(),
      video: z.string().optional(),
      cover: image()
        .refine((img) => img.width >= 300, {
          message: 'Cover image must be at least 300 pixels wide!'
        })
        .optional(),
      tags: z.array(
        z.object({
          name: z.string(),
          class: z.string(),
          icon: z.any().optional()
        })
      ),
      isDraft: z.boolean(),
      github: z.string().optional(),
      language: z.string()
    })
})

export const collections = { projects }
