import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects'
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      link: z.string().optional(),
      video: z.string().optional(),
      cover: image().optional(),
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
