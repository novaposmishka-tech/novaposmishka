/**
 * Point fixes for strings Strapi's own Ukrainian translation leaves in
 * English.
 *
 * Deliberately not a full translation: Strapi ships Ukrainian and covers
 * almost all of the admin, and a wholesale override would have to be kept in
 * step with every upgrade for no gain. Only genuine gaps belong here, found by
 * looking at the running admin — add a line when one turns up.
 */
export const uk = {
  // i18n plugin: the "AVAILABLE IN" column on a localized list view.
  "i18n.list-view.table.header.label": "Доступно в",
  // content-manager: the "STATUS" column header and its filter label.
  "content-manager.containers.list.filters.status": "Статус",
}
