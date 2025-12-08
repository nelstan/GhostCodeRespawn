<template>
  <div class="w-[800px] mt-[80px]">
    <GhostCodeLogo />
    
    <CreatePost @post-created="$emit('post-created', $event)" />
    
    <div>
      <PostsComponents
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @like-post="$emit('like-post', post.id)"
        @comment-post="$emit('comment-post', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import PostsComponents from '@/components/PostsComponents.vue'
import CreatePost from '@/pages/CreatePost.vue'
import { defineEmits, defineProps } from 'vue'
import GhostCodeLogo from './GhostCodeLogo.vue'

const props = defineProps({
  posts: {
    type: Array,
    default: () => []
  }
})

defineEmits(['post-created', 'like-post', 'comment-post'])
</script>