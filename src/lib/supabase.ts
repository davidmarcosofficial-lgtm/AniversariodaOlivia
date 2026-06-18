import { createClient } from '@supabase/supabase-js';
import { EventSettings, RSVP, WallPost, WallComment, WallReaction, GalleryPhoto, GiftSuggestion } from '../types/database';

// 1. Initialize Supabase client
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase is not configured yet. The application is running in "Local Storage Mode" with full CRUD functionality for a perfect initial experience!'
  );
}

// 2. Default Initial Settings matching precisely the customer's Enchanted Forest requirements
const INITIAL_SETTINGS: EventSettings = {
  id: 'settings-1',
  birthday_name: 'Rávila Melissa',
  birthday_age: '1 aninho',
  hero_title: 'O bosque está em festa!',
  invite_text: 'Venha comemorar meu primeiro aninho em uma aventura no bosque encantado!',
  event_date: '13.06',
  event_time: '19:00',
  weekday: 'Sábado',
  address: 'Espaço Encantado, Rua dos Coelhos, 100 - Bosque das Borboletas',
  maps_url: 'https://maps.google.com/?q=Espaço+Encantado+Bosque+das+Borboletas',
  gift_url: 'https://www.quepresente.com.br/ravila-melissa',
  primary_color: '#F4D9E1', // Delicate pale pink
  secondary_color: '#8FA89B', // Sage green
  background_color: '#FAF6F0', // Soft warm off-white beige
  button_color: '#E66C86', // Classic pink buttons
  text_color: '#4A3B32', // Rich cozy charcoal branch/bark brown
  enable_wall: true,
  enable_comments: true,
  enable_photo_upload: true,
  wall_requires_approval: false, // Default: no approval needed, can be toggled
};

const INITIAL_PHOTOS: GalleryPhoto[] = [
  {
    id: 'photo-1',
    photo_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop',
    title: 'Meus primeiros passinhos',
    description: 'Explorando cada pedaço de natureza e sorrindo para as flores.',
    sort_order: 1,
    is_active: true
  },
  {
    id: 'photo-2',
    photo_url: 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?q=80&w=600&auto=format&fit=crop',
    title: 'Meu sorriso do dia a dia',
    description: 'Espalhando gargalhadas e alegria com meus bichinhos favoritos.',
    sort_order: 2,
    is_active: true
  },
  {
    id: 'photo-3',
    photo_url: 'https://images.unsplash.com/photo-1471286174240-e6458e7b3044?q=80&w=600&auto=format&fit=crop',
    title: 'Minha primeira frutinha',
    description: 'Uma tarde cheia de descobertas e sabores docinhos no bosque.',
    sort_order: 3,
    is_active: true
  },
];

const INITIAL_WALL_POSTS: WallPost[] = [
  {
    id: 'post-1',
    author_name: 'Vovó Maria',
    message: 'Minha princesinha! Que o papai do céu cubra seu caminho de flores e luz. Vovó ama demais essa coelhinha do bosque! ✨🌸',
    is_approved: true,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    reactions: { heart: 5, flower: 3, star: 2 }
  },
  {
    id: 'post-2',
    author_name: 'Tio Thiago',
    message: 'Parabéns Rávila Melissa! O bosque encantado está todo alegre com seu 1º aninho de aventuras! Logo logo estamos aí para dar muitos abraços!',
    is_approved: true,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    reactions: { heart: 2, care: 3 }
  }
];

const INITIAL_COMMENTS: WallComment[] = [
  {
    id: 'comment-1',
    post_id: 'post-1',
    author_name: 'Mamãe',
    comment: 'Obrigada mamãe por todo carinho com nossa pitoca!',
    is_approved: true,
    created_at: new Date(Date.now() - 3600000 * 23).toISOString()
  }
];

const INITIAL_GIFTS: GiftSuggestion[] = [
  {
    id: 'gift-1',
    category: 'mimos para a mamãe',
    name: 'Frauda (qualquer marca)',
    description: 'G'
  },
  {
    id: 'gift-2',
    category: 'mimos para a bebê',
    name: 'Brinquedos',
    description: '1 ano+'
  }
];

// Helper to handle localStorage interactions safely
const getLocalStorageData = <T>(key: string, initial: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return initial;
  }
};

const setLocalStorageData = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// 3. Complete Storage and Query Layer (Unified interface)
export const db = {
  // --- SETTINGS ---
  async getSettings(): Promise<EventSettings> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('event_settings')
        .select('*')
        .maybeSingle();
      if (!error && data) return data;
      
      // If none exists, seed and return
      if (error || !data) {
        const { data: seeded, error: seedErr } = await supabase
          .from('event_settings')
          .insert([INITIAL_SETTINGS])
          .select()
          .single();
        if (!seedErr && seeded) return seeded;
      }
    }
    return getLocalStorageData('bosque_settings', INITIAL_SETTINGS);
  },

  async updateSettings(settings: Partial<EventSettings>): Promise<EventSettings> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('event_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq('id', 'settings-1') // or settings id
        .select()
        .single();
      if (!error && data) return data;
    }
    
    const curr = getLocalStorageData('bosque_settings', INITIAL_SETTINGS);
    const updated = { ...curr, ...settings, updated_at: new Date().toISOString() };
    setLocalStorageData('bosque_settings', updated);
    return updated;
  },

  // --- RSVPS ---
  async getRSVPs(): Promise<RSVP[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return getLocalStorageData<RSVP[]>('bosque_rsvps', []);
  },

  async createRSVP(rsvp: Omit<RSVP, 'id' | 'created_at' | 'updated_at'>): Promise<RSVP> {
    const newRsvp: RSVP = {
      ...rsvp,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('rsvps')
        .insert([newRsvp])
        .select()
        .single();
      if (!error && data) return data;
      console.error('Supabase RSVP insert error:', error);
    }

    const curr = getLocalStorageData<RSVP[]>('bosque_rsvps', []);
    const updated = [newRsvp, ...curr];
    setLocalStorageData('bosque_rsvps', updated);
    return newRsvp;
  },

  async updateRSVP(id: string, rsvp: Partial<RSVP>): Promise<RSVP> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('rsvps')
        .update({ ...rsvp, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    }

    const curr = getLocalStorageData<RSVP[]>('bosque_rsvps', []);
    const idx = curr.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('RSVP not found');
    
    const updatedRsvp = { ...curr[idx], ...rsvp, updated_at: new Date().toISOString() };
    curr[idx] = updatedRsvp;
    setLocalStorageData('bosque_rsvps', curr);
    return updatedRsvp;
  },

  async deleteRSVP(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('rsvps')
        .delete()
        .eq('id', id);
      if (!error) return true;
    }

    const curr = getLocalStorageData<RSVP[]>('bosque_rsvps', []);
    const filtered = curr.filter(r => r.id !== id);
    setLocalStorageData('bosque_rsvps', filtered);
    return true;
  },

  // --- WALL POSTS ---
  async getWallPosts(includeUnapproved = false): Promise<WallPost[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('wall_posts').select('*');
      if (!includeUnapproved) {
        query = query.eq('is_approved', true);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) {
        // Fetch all comments and reactions and join them
        const posts: WallPost[] = [];
        for (const post of data) {
          const { data: comments } = await supabase
            .from('wall_comments')
            .select('*')
            .eq('post_id', post.id)
            .order('created_at', { ascending: true });
          
          const { data: reactions } = await supabase
            .from('wall_reactions')
            .select('reaction_type')
            .eq('post_id', post.id);

          const rMap: Record<string, number> = {};
          reactions?.forEach(r => {
            rMap[r.reaction_type] = (rMap[r.reaction_type] || 0) + 1;
          });

          posts.push({
            ...post,
            comments: comments || [],
            reactions: rMap
          });
        }
        return posts;
      }
    }

    // LocalStorage joined
    const localPosts = getLocalStorageData<WallPost[]>('bosque_wall_posts', INITIAL_WALL_POSTS);
    const localComments = getLocalStorageData<WallComment[]>('bosque_wall_comments', INITIAL_COMMENTS);
    const localReactions = getLocalStorageData<WallReaction[]>('bosque_wall_reactions', []);

    const result = localPosts
      .filter(p => includeUnapproved || p.is_approved)
      .map(p => {
        const comments = localComments.filter(c => c.post_id === p.id && (includeUnapproved || c.is_approved));
        const reactions = localReactions.filter(r => r.post_id === p.id);
        const rMap: Record<string, number> = { ...(p.reactions || {}) };
        reactions.forEach(r => {
          rMap[r.reaction_type] = (rMap[r.reaction_type] || 0) + 1;
        });
        return {
          ...p,
          comments,
          reactions: rMap
        };
      });

    return result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  },

  async createWallPost(post: { author_name: string; message: string; photo_url?: string; is_approved: boolean }): Promise<WallPost> {
    const newPost: WallPost = {
      ...post,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reactions: {},
      comments: []
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('wall_posts')
        .insert([newPost])
        .select()
        .single();
      if (!error && data) return data;
    }

    const curr = getLocalStorageData<WallPost[]>('bosque_wall_posts', INITIAL_WALL_POSTS);
    const updated = [newPost, ...curr];
    setLocalStorageData('bosque_wall_posts', updated);
    return newPost;
  },

  async updateWallPost(id: string, post: Partial<WallPost>): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('wall_posts')
        .update({ ...post, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (!error) return true;
    }

    const curr = getLocalStorageData<WallPost[]>('bosque_wall_posts', INITIAL_WALL_POSTS);
    const idx = curr.findIndex(p => p.id === id);
    if (idx !== -1) {
      curr[idx] = { ...curr[idx], ...post, updated_at: new Date().toISOString() };
      setLocalStorageData('bosque_wall_posts', curr);
    }
    return true;
  },

  async updateWallPostStatus(id: string, is_approved: boolean): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('wall_posts')
        .update({ is_approved, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (!error) return true;
    }

    const curr = getLocalStorageData<WallPost[]>('bosque_wall_posts', INITIAL_WALL_POSTS);
    const idx = curr.findIndex(p => p.id === id);
    if (idx !== -1) {
      curr[idx].is_approved = is_approved;
      curr[idx].updated_at = new Date().toISOString();
      setLocalStorageData('bosque_wall_posts', curr);
    }
    return true;
  },

  async deleteWallPost(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('wall_posts')
        .delete()
        .eq('id', id);
      if (!error) return true;
    }

    const curr = getLocalStorageData<WallPost[]>('bosque_wall_posts', INITIAL_WALL_POSTS);
    const filtered = curr.filter(p => p.id !== id);
    setLocalStorageData('bosque_wall_posts', filtered);
    return true;
  },

  // --- WALL COMMENTS ---
  async getComments(postId: string): Promise<WallComment[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('wall_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (!error && data) return data;
    }
    const all = getLocalStorageData<WallComment[]>('bosque_wall_comments', INITIAL_COMMENTS);
    return all.filter(c => c.post_id === postId);
  },

  async createComment(comment: { post_id: string; author_name: string; comment: string; is_approved: boolean }): Promise<WallComment> {
    const newComment: WallComment = {
      ...comment,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('wall_comments')
        .insert([newComment])
        .select()
        .single();
      if (!error && data) return data;
    }

    const curr = getLocalStorageData<WallComment[]>('bosque_wall_comments', INITIAL_COMMENTS);
    const updated = [...curr, newComment];
    setLocalStorageData('bosque_wall_comments', updated);
    return newComment;
  },

  async updateCommentStatus(id: string, is_approved: boolean): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('wall_comments')
        .update({ is_approved, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (!error) return true;
    }

    const curr = getLocalStorageData<WallComment[]>('bosque_wall_comments', INITIAL_COMMENTS);
    const idx = curr.findIndex(c => c.id === id);
    if (idx !== -1) {
      curr[idx].is_approved = is_approved;
      curr[idx].updated_at = new Date().toISOString();
      setLocalStorageData('bosque_wall_comments', curr);
    }
    return true;
  },

  async deleteComment(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('wall_comments')
        .delete()
        .eq('id', id);
      if (!error) return true;
    }

    const curr = getLocalStorageData<WallComment[]>('bosque_wall_comments', INITIAL_COMMENTS);
    const filtered = curr.filter(c => c.id !== id);
    setLocalStorageData('bosque_wall_comments', filtered);
    return true;
  },

  // --- REACTIONS ---
  async addReaction(postId: string, reactionType: string, visitorToken: string): Promise<boolean> {
    const newReaction = {
      id: crypto.randomUUID(),
      post_id: postId,
      reaction_type: reactionType,
      visitor_token: visitorToken,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      // Check if reaction already exists from this visitor (optional, but keep it simple/additive)
      const { data: existing } = await supabase
        .from('wall_reactions')
        .select('id')
        .eq('post_id', postId)
        .eq('reaction_type', reactionType)
        .eq('visitor_token', visitorToken)
        .maybeSingle();

      if (existing) {
        // Toggle/remove if clicked again
        await supabase
          .from('wall_reactions')
          .delete()
          .eq('id', existing.id);
        return false;
      } else {
        await supabase
          .from('wall_reactions')
          .insert([newReaction]);
        return true;
      }
    }

    // Local fallback toggle
    const curr = getLocalStorageData<any[]>('bosque_wall_reactions', []);
    const idx = curr.findIndex(r => r.post_id === postId && r.reaction_type === reactionType && r.visitor_token === visitorToken);
    
    if (idx !== -1) {
      curr.splice(idx, 1);
      setLocalStorageData('bosque_wall_reactions', curr);
      return false; // Removed
    } else {
      curr.push(newReaction);
      setLocalStorageData('bosque_wall_reactions', curr);
      return true; // Added
    }
  },

  // --- GALLERY ---
  async getGalleryPhotos(onlyActive = true): Promise<GalleryPhoto[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('gallery_photos').select('*');
      if (onlyActive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query.order('sort_order', { ascending: true });
      if (!error && data) return data;
    }

    const localPhotos = getLocalStorageData<GalleryPhoto[]>('bosque_gallery_photos', INITIAL_PHOTOS);
    const filtered = onlyActive ? localPhotos.filter(p => p.is_active) : localPhotos;
    return filtered.sort((a, b) => a.sort_order - b.sort_order);
  },

  async addGalleryPhoto(photo: Omit<GalleryPhoto, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryPhoto> {
    const newPhoto: GalleryPhoto = {
      ...photo,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('gallery_photos')
        .insert([newPhoto])
        .select()
        .single();
      if (!error && data) return data;
    }

    const curr = getLocalStorageData<GalleryPhoto[]>('bosque_gallery_photos', INITIAL_PHOTOS);
    const updated = [...curr, newPhoto];
    setLocalStorageData('bosque_gallery_photos', updated);
    return newPhoto;
  },

  async updateGalleryPhoto(id: string, photo: Partial<GalleryPhoto>): Promise<GalleryPhoto> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('gallery_photos')
        .update({ ...photo, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    }

    const curr = getLocalStorageData<GalleryPhoto[]>('bosque_gallery_photos', INITIAL_PHOTOS);
    const idx = curr.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Photo not found');

    const updatedPhoto = { ...curr[idx], ...photo, updated_at: new Date().toISOString() };
    curr[idx] = updatedPhoto;
    setLocalStorageData('bosque_gallery_photos', curr);
    return updatedPhoto;
  },

  async deleteGalleryPhoto(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('gallery_photos')
        .delete()
        .eq('id', id);
      if (!error) return true;
    }

    const curr = getLocalStorageData<GalleryPhoto[]>('bosque_gallery_photos', INITIAL_PHOTOS);
    const filtered = curr.filter(p => p.id !== id);
    setLocalStorageData('bosque_gallery_photos', filtered);
    return true;
  },

  // --- STORAGE UPLOAD MOCK & REAL ---
  async uploadImage(bucket: 'birthday-gallery' | 'wall-uploads' | 'design-assets', file: File): Promise<string> {
    if (isSupabaseConfigured && supabase) {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      let { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (error && (error.message?.includes('not found') || error.message?.includes('Bucket') || (error as any).statusCode === '404' || (error as any).status === 404)) {
        try {
          // Attempt to dynamically create the public bucket if absent
          const { error: createError } = await supabase.storage.createBucket(bucket, {
            public: true
          });
          if (!createError) {
            // Retry upload
            const retryResult = await supabase.storage
              .from(bucket)
              .upload(fileName, file, { cacheControl: '3600', upsert: true });
            data = retryResult.data;
            error = retryResult.error;
          }
        } catch (bucketErr) {
          console.warn('Unable to automatically provision bucket:', bucketErr);
        }
      }

      if (error) {
        console.warn('Supabase upload skipped (falling back to client layout):', error.message || error);
      } else if (data) {
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);
        return urlData.publicUrl;
      }
    }

    // Local upload fallback: Convert file to Base64 data URL for local persistence and representation
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  },

  // --- GIFT SUGGESTIONS ---
  async checkGiftSuggestionsTableExists(): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('gift_suggestions')
        .select('id')
        .limit(1);
      if (error && (error.code === 'PGRST205' || error.message?.includes('gift_suggestions'))) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  async getGiftSuggestions(): Promise<GiftSuggestion[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('gift_suggestions')
          .select('*')
          .order('category', { ascending: true })
          .order('created_at', { ascending: true });
        if (!error && data) return data;
        if (error && (error.code === 'PGRST205' || error.message?.includes('gift_suggestions'))) {
          console.warn('Tabela gift_suggestions não encontrada no Supabase. Utilizando fallback local.');
        } else if (error) {
          console.error('Erro ao ler gift_suggestions no Supabase:', error);
        }
      } catch (err) {
        console.warn('Falling back to local gifts due to database error:', err);
      }
    }
    return getLocalStorageData<GiftSuggestion[]>('bosque_gift_suggestions', INITIAL_GIFTS);
  },

  async addGiftSuggestion(gift: Omit<GiftSuggestion, 'id' | 'created_at' | 'updated_at'>): Promise<GiftSuggestion> {
    const newGift: GiftSuggestion = {
      ...gift,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('gift_suggestions')
          .insert([newGift])
          .select()
          .single();
        if (!error && data) return data;
        if (error && (error.code === 'PGRST205' || error.message?.includes('gift_suggestions'))) {
          console.warn('Supabase table gift_suggestions not found during insert. Saved fallback to client storage.');
        } else if (error) {
          console.error('Supabase gift suggestions insert error:', error);
        }
      } catch (err) {
        console.warn('Error during Supabase gift upload, using fallback:', err);
      }
    }

    const curr = getLocalStorageData<GiftSuggestion[]>('bosque_gift_suggestions', INITIAL_GIFTS);
    const updated = [...curr, newGift];
    setLocalStorageData('bosque_gift_suggestions', updated);
    return newGift;
  },

  async updateGiftSuggestion(id: string, gift: Partial<GiftSuggestion>): Promise<GiftSuggestion> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('gift_suggestions')
          .update({ ...gift, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Error during Supabase gift update, using fallback:', err);
      }
    }

    const curr = getLocalStorageData<GiftSuggestion[]>('bosque_gift_suggestions', INITIAL_GIFTS);
    const idx = curr.findIndex(g => g.id === id);
    if (idx === -1) throw new Error('Gift suggestion not found');

    const updatedGift = { ...curr[idx], ...gift, updated_at: new Date().toISOString() };
    curr[idx] = updatedGift;
    setLocalStorageData('bosque_gift_suggestions', curr);
    return updatedGift;
  },

  async deleteGiftSuggestion(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('gift_suggestions')
          .delete()
          .eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Error during Supabase gift delete, using fallback:', err);
      }
    }

    const curr = getLocalStorageData<GiftSuggestion[]>('bosque_gift_suggestions', INITIAL_GIFTS);
    const filtered = curr.filter(g => g.id !== id);
    setLocalStorageData('bosque_gift_suggestions', filtered);
    return true;
  }
};
