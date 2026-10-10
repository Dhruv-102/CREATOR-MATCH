import type {
  Creator,
  CollaborationInquiry,
  CreatorFilterOptions,
  BrandProfile,
  CreatorUserProfile,
} from './types.js';

export async function fetchCreators(options?: Partial<CreatorFilterOptions>): Promise<Creator[]> {
  const params = new URLSearchParams();
  if (options?.search) params.set('q', options.search);
  if (options?.platform && options.platform !== 'all') params.set('platform', options.platform);
  if (options?.niche && options.niche !== 'all') params.set('niche', options.niche);
  if (options?.followerTier && options.followerTier !== 'all') params.set('followerTier', options.followerTier);
  if (options?.minEngagement && options.minEngagement > 0) params.set('minEngagement', String(options.minEngagement));
  if (options?.country && options.country !== 'all') params.set('country', options.country);
  if (options?.state && options.state !== 'all') params.set('state', options.state);
  if (options?.city && options.city !== 'all') params.set('city', options.city);
  if (options?.sortBy) params.set('sortBy', options.sortBy);

  const url = `/api/creators${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load creators: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data || [];
}

export async function fetchCreatorById(id: string): Promise<Creator> {
  const res = await fetch(`/api/creators/${encodeURIComponent(id)}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch creator profile`);
  }
  const json = await res.json();
  return json.data;
}

export async function createCreator(creatorData: Partial<Creator>): Promise<Creator> {
  const res = await fetch('/api/creators', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creatorData),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Failed to create creator profile');
  }
  const json = await res.json();
  return json.data;
}

export async function updateCreator(id: string, updates: Partial<Creator>): Promise<Creator> {
  const res = await fetch(`/api/creators/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Failed to update creator profile');
  }
  const json = await res.json();
  return json.data;
}

export async function deleteCreator(id: string): Promise<void> {
  const res = await fetch(`/api/creators/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete creator profile');
  }
}

export async function resetDatabase(): Promise<Creator[]> {
  const res = await fetch('/api/creators/reset', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset creator directory');
  const json = await res.json();
  return json.data;
}

export async function submitInquiry(inquiryData: Partial<CollaborationInquiry>): Promise<CollaborationInquiry> {
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiryData),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Failed to submit proposal');
  }
  const json = await res.json();
  return json.data;
}

export async function fetchInquiries(): Promise<CollaborationInquiry[]> {
  const res = await fetch('/api/inquiries');
  if (!res.ok) throw new Error('Failed to fetch inquiries');
  const json = await res.json();
  return json.data || [];
}

export async function loginBrand(data: Partial<BrandProfile>): Promise<BrandProfile> {
  const res = await fetch('/api/auth/brand/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Brand sign-in failed');
  }
  const json = await res.json();
  return json.data;
}

export async function loginCreator(
  data: any
): Promise<{ user: CreatorUserProfile; creatorProfile: Creator }> {
  const res = await fetch('/api/auth/creator/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Creator sign-in failed');
  }
  const json = await res.json();
  return { user: json.data, creatorProfile: json.creatorProfile };
}
