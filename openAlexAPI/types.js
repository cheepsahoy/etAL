/**
 * @typedef OAWorkObject
 * @property {object} abstract_inverted_index
 * Each word is key, value is its word# in the abstract
 * @property {array} authorships
 * @property {object} apc_list
 * @property {{
 *  'value': integer,
 *  'currency': String,
 *  'provenance': String,
 *  'value_usd': integer,
 * }} apc_paid
 * @property { {
 *  'is_oa': boolean,
 *  'land_page_url': string,
 *  'pdf_url': string,
 *  'source': object,
 *  'license': string,
 *  'version': string}} best_oa_location
 * @property {{
 *  'volume': string,
 *  'issue': string,
 *  'first_page': string,
 *  'last_page': string,}} biblio
 * @property {{
 *  'value': integer,
 *  'is_in_top_1_percent': boolean,
 *  'is_in_top_10_percent': boolean}} citation_normalized_percentile
 * @property {string} cited_by_api_url
 * @property {integer} cited_by_count
 * @property {array} concepts
 * concepts are search term topics, they are objects with:
 * id: string,
 * wikidata: string,
 * display_name: string,
 * level: integer,
 * score: integer,
 * @property {array} corresponding_author_ids
 * @property {array} corresponding_institution_ids
 * @property {integer} countries_distinct_count
 * @property {array} counts_by_year
 * array contains object with properties explaining the year and # of citations that year
 * year: integer,
 * cited_by_count: integer,
 * @property {string} created_date
 * @property {string} display_name
 * @property {string} doi
 * @property {string} fulltext_origin
 * @property {integer} fwci
 * @property {array} grants
 * array contains objects with following properties:
 * funder: string,
 * funder_display_name: string,
 * award_id: string,
 * @property {boolean} has_fulltext
 * @property {string} id
 * @property {{
 *  'doi': string,
 *  'mag': integer,
 *  'openalex': string,
 *  'pmid': string,
 *  'pmcid': string,}} ids
 * @property {array} indexed_in
 * @property {integer} institutions_distinct_count
 * @property {boolean} is_paratext
 * @property {boolean} is_retracted
 * @property {array} keywords
 * provides an array of objects that are keywords. each index object has these properties:
 * id: string,
 * display_name: string,
 * score: integer,
 * @property {string} language
 * @property {string} license
 * @property {array} locations
 * provides array of locations object has been, mulitple properties w/ objects - not reproducing for clutter
 * @property {integer} locations_count
 * @property {array} mesh
 * array of mesh properties, relevent for PubMed only
 * @property {{
 *  'is_oa': boolean,
 *  'oa_status': string,
 *  'oa_url': string,
 *  'any_repository_has_fulltext': boolean}} open_access
 * @property {{
 *  'is_oa': boolean,
 *  'landing_page_url': string,
 *  'pdf_url': string,
 *  'source': object
 *      'id': string,
 *      'display_name': string,
 *      'issn_1': string,
 *      'issn': array,
 *      'host_organization': string,
 *      'type': string,
 *  'license': string,
 *  'version': string}} primary_location
 * @property {{
 *  'id': string,
 *  'display_name': string,
 *  'score': integer,
 *  'subfield': object
 *      'id': integer,
 *      'display_name': string,
 *  'domain': object
 *      'id': integer,
 *      'display_name': string}} primary_topic
 * @property {string} publication_date
 * @property {string} publication_year
 * @property {array} referenced_works
 * @property {array} related_works
 * @property {array} sustainable_development_goals
 * contains objects with properties:
 * id: string,
 * display_name: string,
 * score: integer
 * @property {array} topics
 * top 3 ranked topics for the work, not reproducing because clutter
 * @property {string} title
 * @property {string} type
 * @property {string} type_crossref
 * @property {string} updated_date
 */