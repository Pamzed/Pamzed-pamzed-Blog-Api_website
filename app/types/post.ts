export type postType = {
  blog_title: string;
  blog_image: any;
  blog_feature_image: any;
  blog_short_description: string;
  blog_content: string;
  blog_categories: string;
};

export interface PostType {
  id: string;
  admins_id: string;
  blog_author: string;
  blog_content: string;
  blog_feature_image: string;
  blog_image: string;
  blog_short_description: string;
  blog_title: string;
  blog_view_count: string;
  categories: any[];
  categories_id: any;
}
