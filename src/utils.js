export function getId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '');
}

export function notifySave(title) {
  this.$notify({
    group: 'alerts',
    title: 'Snippet Saved',
    text: `${title} was saved!`
  });
}

export function notifyPin(title = 'Untitled Snippet', isPinned) {
  const pinned = isPinned ? 'pinned' : 'un-pinned';

  this.$notify({
    group: 'alerts',
    type: 'warn',
    title: 'Snippet Pinned',
    text: `${title} was ${pinned}!`
  });
}

export function notifyDelete(title) {
  this.$notify({
    group: 'alerts',
    type: 'success',
    title: 'Snippet Deleted',
    text: `${title} was deleted!`
  });
}