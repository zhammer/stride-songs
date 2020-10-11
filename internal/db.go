package internal

import "github.com/go-pg/pg/v10/orm"

type relationshipFunc func(*orm.Query) (*orm.Query, error)

func withWhere(condition string, params ...interface{}) relationshipFunc {
	return func(q *orm.Query) (*orm.Query, error) {
		return q.Where(condition, params...), nil
	}
}

func WithOrderBy(column string) relationshipFunc {
	return func(q *orm.Query) (*orm.Query, error) {
		return q.Order(column), nil
	}
}
