import { supabase } from '../lib/supabase.js'

export const dataService = {
  // ===== PROFILS =====
  async getProfiles() {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Erreur lors de la récupération des profils:', error)
      throw error
    }
    return data
  },

  async createProfile(name) {
    const { data, error } = await supabase.from('profile').insert([{ name }]).select()

    if (error) {
      console.error('Erreur lors de la création du profil:', error)
      throw error
    }
    return data[0]
  },

  async getProfile(id) {
    const { data, error } = await supabase.from('profile').select('*').eq('id', id).single()

    if (error) {
      console.error('Erreur lors de la récupération du profil:', error)
      throw error
    }
    return data
  },

  // ===== LISTES DE COURSES =====
  async getShoppingLists(profileId) {
    const { data, error } = await supabase
      .from('list-shopping')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération des listes:', error)
      throw error
    }

    // Parser les items JSON
    return data.map((list) => ({
      ...list,
      items: typeof list.items === 'string' ? JSON.parse(list.items) : list.items || [],
    }))
  },

  async createShoppingList(profileId, items = []) {
    const { data, error } = await supabase
      .from('list-shopping')
      .insert([
        {
          profile_id: profileId,
          items: JSON.stringify(items),
        },
      ])
      .select()

    if (error) {
      console.error('Erreur lors de la création de la liste:', error)
      throw error
    }

    const list = data[0]
    return {
      ...list,
      items: typeof list.items === 'string' ? JSON.parse(list.items) : list.items || [],
    }
  },

  async updateShoppingList(listId, items) {
    const { data, error } = await supabase
      .from('list-shopping')
      .update({ items: JSON.stringify(items) })
      .eq('id', listId)
      .select()

    if (error) {
      console.error('Erreur lors de la mise à jour de la liste:', error)
      throw error
    }

    const list = data[0]
    return {
      ...list,
      items: typeof list.items === 'string' ? JSON.parse(list.items) : list.items || [],
    }
  },

  async deleteShoppingList(listId) {
    const { error } = await supabase.from('list-shopping').delete().eq('id', listId)

    if (error) {
      console.error('Erreur lors de la suppression de la liste:', error)
      throw error
    }
  },

  // ===== UTILITAIRES =====
  async getOrCreateDefaultList(profileId) {
    const lists = await this.getShoppingLists(profileId)

    if (lists.length === 0) {
      // Créer une liste par défaut
      return await this.createShoppingList(profileId, [])
    }

    return lists[0] // Retourner la liste la plus récente
  },
}
