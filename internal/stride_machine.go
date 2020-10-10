package internal

import (
	"context"
	"fmt"
)

type StrideMachine struct {
	*StrideSongs
}

func (sm *StrideMachine) HandleStrideEvent(ctx context.Context, event StrideEvent) error {
	// load relations
	if err := sm.db.Model(&event).WherePK().Relation("User").Relation("User.Playlists").Select(); err != nil {
		return err
	}

	if event.User.LibrarySyncStatus != LibrarySyncStatusSucceeded {
		return fmt.Errorf("can't handle stride events until user's library sync has succeeded")
	}

	switch event.Type {
	case strideEventTypeStart:
		return sm.handleStrideEventStart(ctx, event)
	case strideEventTypeFinish:
		return sm.handleStrideEventFinish(ctx, event)
	case strideEventTypeSpmUpdate:
		return sm.handleStrideEventSpmUpdate(ctx, event)
	default:
		return fmt.Errorf("unrecognized stride event type: %s", event.Type)
	}
}

func (sm *StrideMachine) handleStrideEventStart(ctx context.Context, event StrideEvent) error {
	return ErrNotImplemented
}

func (sm *StrideMachine) handleStrideEventFinish(ctx context.Context, event StrideEvent) error {
	return ErrNotImplemented
}

func (sm *StrideMachine) handleStrideEventSpmUpdate(ctx context.Context, event StrideEvent) error {
	return ErrNotImplemented
}
